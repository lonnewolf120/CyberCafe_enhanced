const { query, queryWP } = require("./origins/default.js");
const jwt = require("jsonwebtoken");
const { connection } = require("./database.js");

async function createAccount(USER_ID, BALANCE = 100) {
  let sql = `INSERT INTO MCSC.ACCOUNT (USER_ID, BALANCE) VALUES (:USER_ID, :BALANCE);`;
  let res = await query(sql, { USER_ID: USER_ID, BALANCE: BALANCE }, "", "");
  return res;
}

async function createPaymentPL(options){

  plsql = `
SET SERVEROUTPUT ON
DECLARE
  -- Variables to hold account data and transaction information
  v_userid VARCHAR2(20) := :userid;
  v_balance MCSC.ACCOUNT.BALANCE%TYPE;
  v_account_id MCSC.ACCOUNT.ACCOUNT_ID%TYPE;
  v_trxid VARCHAR2(4000);
  v_amount NUMBER := :amount;
  v_date TIMESTAMP := TO_TIMESTAMP(:date, 'YYYY-MM-DD HH24:MI:SS');
BEGIN
  -- Step 1: Check if account exists and retrieve balance
  BEGIN
    SELECT BALANCE, ACCOUNT_ID
    INTO v_balance, v_account_id
    FROM MCSC.ACCOUNT
    WHERE USER_ID = v_userid;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      -- Account does not exist, create a new account
      INSERT INTO MCSC.ACCOUNT (USER_ID, BALANCE)
      VALUES (v_userid, 100);
      v_balance := 100;
--      v_account_id := (SELECT ACCOUNT_ID FROM MCSC.ACCOUNT WHERE USER_ID = v_userid);
  END;

  -- Step 2: Check balance and update if sufficient
  IF v_balance < v_amount THEN
    RAISE_APPLICATION_ERROR(-20001, 'Insufficient Balance, current balance: ' || v_balance || ' amount required: ' || v_amount);
  ELSE
    -- Update account balance
    UPDATE MCSC.ACCOUNT
    SET BALANCE = BALANCE - v_amount
    WHERE USER_ID = v_userid;
  END IF;

  -- Step 3: Generate TRXID
      v_trxid := :userid || '-' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS');

  -- Step 4: Insert transaction history
--  INSERT INTO MCSC.TRX_HISTORY (TRXID, USER_ID, ACCOUNT_ID, date_of_trx, amount_of_trx)
--  VALUES (v_trxid, v_userid, v_account_id, v_date, v_amount);

  -- Commit the transaction
  COMMIT;
  
    DBMS_OUTPUT.PUT_LINE('USER TRANSACTION SUCCESSFUL');
EXCEPTION
  WHEN OTHERS THEN
    -- Handle errors
    ROLLBACK;
    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
`
let db = await connection();
try{
  let res = await db.execute(plsql, {userid: options.USER_ID, amount: options.AMOUNT, date: options.DATE});
  try{
  const result = await connection.execute(
    `SELECT * FROM MCSC.TRX_HISTORY WHERE TRXID = :trxid`,
    { trxid: `${options.USER_ID}-${new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14)}` }
  );
  
  if (result.rows.length > 0) {
    console.log('Transaction successful', result.rows);
    return {
      message: 'Transaction successful',
      data: result.rows
    };
  } else {
    console.log('Transaction not found');
    return {
      message: 'Transaction not found',
      data: null
    };
  }
}catch(e){
  console.log("Error in transaction: ", e.message, "ERROR: ", e);
}

}
catch(e){
  console.log("Error in transaction: ", e, "err: ", e);
  return{
    message: `Failed to create transaction for user with ID: ${options.USER_ID}`,
    error: e
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
    console.log(`Failed to get user info for payment USERID: ${options.USER_ID}`, "error: ", e);
  }
  
  console.log(`All account data for ${options.USER_ID}: `, accountData?.rows);
  
  if (accountData?.rows?.length === 0) {
    console.log(`No accounts made for user with id: ${options.USER_ID}`);
    try{
    await db.execute(`INSERT INTO MCSC.ACCOUNT (USER_ID, BALANCE) VALUES (:userid, 100)`, { userid: options.USER_ID });
    await db.commit();
    //retry to get the account data
    sql = `SELECT * FROM MCSC.ACCOUNT WHERE USER_ID = :userid`;
    accountData = await db.execute(sql, { userid: String(options.USER_ID) });

    }catch(e){console.log("Error in creating account: ", e.message, "ERROR: ", e);}
    // return {
    //     message: `No accounts made for user with id: ${options.USER_ID}`,
    //     data: null
    // };
  }
  
  if (accountData?.rows[0]?.BALANCE === 0 || accountData?.rows[0]?.BALANCE < options.AMOUNT) {
    console.log(`Insufficient Balance, current balance: ${accountData?.rows[0]?.BALANCE}`);
    return {
      message: `Insufficient Balance, current balance: ${accountData?.rows[0]?.BALANCE}`,
      data: null,
    };
  }
  
  try {
    sql = `UPDATE MCSC.ACCOUNT 
           SET BALANCE = BALANCE - :amnt
           WHERE USER_ID = :userid`;
    updateInfo = await db.execute(
      sql,
      { amnt: options.AMOUNT, userid: String(options.USER_ID) });
    await db.commit();
  } catch (e) {
    console.log(`Failed to update balance for user with ID: ${options.USER_ID}`, "error: ", e);
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
  const trxid = String(options.USER_ID) + accountData?.rows[0]?.ACCOUNT_ID + options.DATE.replace(/[-:.T] /g, '').slice(0, 14);

  console.log(`The generated TRXID: ${trxid}`);
  
  try {
    sql = `INSERT INTO MCSC.TRX_HISTORY (TRXID, USER_ID, ACCOUNT_ID, date_of_trx, amount_of_trx)
           VALUES (:trxid, :userid, :accountid, TO_TIMESTAMP(:datetrx, 'YYYY-MM-DD HH24:MI:SS'), :amnt)`;
    res = await db.execute(
      sql,
      {
        trxid: trxid,
        userid: String(options.USER_ID),
        accountid: accountData?.rows[0]?.ACCOUNT_ID,
        datetrx: options.DATE,
        amnt: options.AMOUNT,
      }
    );
    
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
    console.log(`Failed to insert transaction for user with ID: ${options.USER_ID}`, "error"+ e.message);
    return {
      message: `Failed to insert transaction for user with ID: ${options.USER_ID}`,
      data: null,
    };
  }
}


module.exports = {
  createPayment,
  createAccount,
  createPaymentPL
};
