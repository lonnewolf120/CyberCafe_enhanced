const { query, queryWP } = require("./origins/default.js");
const jwt = require("jsonwebtoken");
const { connection } = require("./database.js");
const oracledb = require("oracledb");

async function createAccount(USER_ID, BALANCE = 100) {
  let sql = `INSERT INTO MCSC.ACCOUNT (USER_ID, BALANCE) VALUES (:USER_ID, :BALANCE)`;
  let res = await query(sql, { USER_ID: USER_ID, BALANCE: BALANCE }, "", "");
  return res;
}

async function createPaymentPL(options) {
  // This is run only once to create the procedure in the database
  const plsql_procedure = `CREATE OR REPLACE PROCEDURE create_payment (
    p_userid   IN  MCSC.ACCOUNT.USER_ID%TYPE,
    p_amount   IN  NUMBER,
    p_date     IN  VARCHAR2,
    p_courses  IN  VARCHAR2,
    p_message  OUT VARCHAR2,
    p_trxid    OUT VARCHAR2
) 
IS
    l_balance     NUMBER;
    l_account_id  MCSC.ACCOUNT.ACCOUNT_ID%TYPE;
BEGIN
    -- Fetch account data
    BEGIN
        SELECT BALANCE, ACCOUNT_ID 
        INTO l_balance, l_account_id
        FROM MCSC.ACCOUNT 
        WHERE USER_ID = p_userid;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            -- Create account if not exists
            INSERT INTO MCSC.ACCOUNT (USER_ID, BALANCE) 
            VALUES (p_userid, 100);
            COMMIT;
            -- Fetch the newly created account data
            SELECT BALANCE, ACCOUNT_ID 
            INTO l_balance, l_account_id
            FROM MCSC.ACCOUNT 
            WHERE USER_ID = p_userid;
    END;

    -- Check balance
    IF l_balance < p_amount THEN
        p_message := 'Insufficient Balance, current balance: ' || l_balance;
        RETURN;
    END IF;

    -- Deduct balance
    UPDATE MCSC.ACCOUNT 
    SET BALANCE = BALANCE - p_amount 
    WHERE USER_ID = p_userid;
    COMMIT;

    -- Generate a smaller TRXID (format: USERID_ACCOUNTID_YYYYMMDD)
    p_trxid := TO_CHAR(p_userid) || '_' || TO_CHAR(l_account_id) || '_' || REPLACE(SUBSTR(p_date, 1, 10), '-', '');

    -- Insert into TRX_HISTORY
    INSERT INTO MCSC.TRX_HISTORY (
        TRXID, USER_ID, ACCOUNT_ID, date_of_trx, amount_of_trx
    ) VALUES (
        p_trxid, p_userid, l_account_id, 
        TO_TIMESTAMP(p_date, 'YYYY-MM-DD HH24:MI:SS'), 
        p_amount
    );
    COMMIT;

    p_message := 'Transaction successful';
EXCEPTION
    WHEN OTHERS THEN
        p_message := 'Transaction failed: ' || SQLERRM;
        ROLLBACK;
END;
/
`;
  let db;
  try {
    db = await connection();
    console.log("Options received(Backend): ", options);
    //convert array to string
    const coursesAsStringArray = options.COURSES.map(course => Number(course));
    const result = await db.execute(
      `BEGIN 
                create_payment(
                    p_userid   => :USER_ID,
                    p_amount   => :AMOUNT,
                    p_date     => :DATE,
                    p_courses  => :COURSES,
                    p_message  => :MESSAGE,
                    p_trxid    => :TRXID
                ); 
             END;`,
      {
        USER_ID: String(options.USER_ID), // Convert USER_ID to string if necessary
        AMOUNT: Number(options.AMOUNT), // The amount as a number
        DATE: options.DATE, // The date as a formatted string 'YYYY-MM-DD HH24:MI:SS'
        COURSES: { 
          type: oracledb.ARRAY,  // Specify the bind type as ARRAY
          dir: oracledb.BIND_IN, // This is an input bind
          val: options.COURSES,  // Pass the Node.js array directly
          typeName: 'MCSC.COURSE_ARRAY'  // Oracle type name
        },
        MESSAGE: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 4000,
        }, // Output message
        TRXID: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 }, // Output transaction ID
      }
    );

    console.log("Message:", result.outBinds.MESSAGE);
    console.log("Transaction ID:", result.outBinds.TRXID);

    return {
      message: result.outBinds.MESSAGE,
      trxid: result.outBinds.TRXID,
    };
  } catch (err) {
    console.error("Error executing create_payment procedure", err);
    throw err;
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (err) {
        console.error("Error closing db", err);
      }
    }
  }
}

async function createPayment(options) {
  let db = await connection();
  let accountData, updateInfo, res, sql;
  console.log("the options: ", options);

  try {
    sql = `SELECT * FROM MCSC.ACCOUNT WHERE USER_ID = :userid`;
    accountData = await db.execute(sql, { userid: String(options.USER_ID) });
  } catch (e) {
    console.log(
      `Failed to get user info for payment USERID: ${options.USER_ID}`,
      "error: ",
      e
    );
  }

  console.log(`All account data for ${options.USER_ID}: `, accountData?.rows);

  if (accountData?.rows?.length === 0) {
    console.log(`No accounts made for user with id: ${options.USER_ID}`);
    try {
      await db.execute(
        `INSERT INTO MCSC.ACCOUNT (USER_ID, BALANCE) VALUES (:userid, 100)`,
        { userid: options.USER_ID }
      );
      await db.commit();
      //retry to get the account data
      sql = `SELECT * FROM MCSC.ACCOUNT WHERE USER_ID = :userid`;
      accountData = await db.execute(sql, { userid: String(options.USER_ID) });
    } catch (e) {
      console.log("Error in creating account: ", e.message, "ERROR: ", e);
    }
    // return {
    //     message: `No accounts made for user with id: ${options.USER_ID}`,
    //     data: null
    // };
  }

  if (
    accountData?.rows[0]?.BALANCE === 0 ||
    accountData?.rows[0]?.BALANCE < options.AMOUNT
  ) {
    console.log(
      `Insufficient Balance, current balance: ${accountData?.rows[0]?.BALANCE}`
    );
    return {
      message: `Insufficient Balance, current balance: ${accountData?.rows[0]?.BALANCE}`,
      data: null,
    };
  }

  try {
    sql = `UPDATE MCSC.ACCOUNT 
           SET BALANCE = BALANCE - :amnt
           WHERE USER_ID = :userid`;
    updateInfo = await db.execute(sql, {
      amnt: options.AMOUNT,
      userid: String(options.USER_ID),
    });
    await db.commit();
  } catch (e) {
    // await db.rollback();
    console.log(
      `Failed to update balance for user with ID: ${options.USER_ID}`,
      "error: ",
      e
    );
    return {
      message: `Failed to update balance for user with ID: ${options.USER_ID}`,
      data: null,
    };
  }

  if (!updateInfo)
    return {
      message: `Transaction failed user data: ${accountData?.rows[0]}`,
      update: updateInfo,
      data: null,
    };

  //hash the options var to make the TRX data
  // const trxid = jwt.sign(options, process.env.JWT_SECRET);
  const trxid =
    String(options.USER_ID) +
    accountData?.rows[0]?.ACCOUNT_ID +
    options.DATE.replace(/[-:.T] /g, "").slice(0, 14);

  console.log(`The generated TRXID: ${trxid}`);

  try {
    sql = `INSERT INTO MCSC.TRX_HISTORY (TRXID, USER_ID, ACCOUNT_ID, date_of_trx, amount_of_trx)
           VALUES (:trxid, :userid, :accountid, TO_TIMESTAMP(:datetrx, 'YYYY-MM-DD HH24:MI:SS'), :amnt)`;
    res = await db.execute(sql, {
      trxid: trxid,
      userid: String(options.USER_ID),
      accountid: accountData?.rows[0]?.ACCOUNT_ID,
      datetrx: options.DATE,
      amnt: options.AMOUNT,
    });

    await db.commit();
    console.log(`Transaction successful`, res);
    return {
      message: `Transaction successful`,
      data: res,
      update: updateInfo,
      trxid: trxid,
      user: options.USER_ID,
      account: accountData?.rows[0]?.ACCOUNT_ID,
      date: options.DATE,
      boughtCourse: options.COURSES,
    };
  } catch (e) {
    // await db.rollback();
    console.log(
      `Failed to insert transaction for user with ID: ${options.USER_ID}`,
      "error" + e.message
    );
    return {
      message: `Failed to insert transaction for user with ID: ${options.USER_ID}`,
      data: null,
    };
  }
}

module.exports = {
  createPayment,
  createAccount,
  createPaymentPL,
};
