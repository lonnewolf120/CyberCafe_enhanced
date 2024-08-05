const oracledb = require("oracledb");
// const { connection } = require("../database");
const { connection } = require("../database/database.js");
const mailSender = require("../utils/mailSender");
const EMAILTemplate = require("../mail/templates/EMAILVerificationTemplate");

async function insertOTP(EMAIL, otp) {
  let db;
  try {
    db = await connection();
    const sql = `
      INSERT INTO MCSC.OTP (EMAIL, otp)
      VALUES (:EMAIL, :otp)
    `;
    const binds = { EMAIL, otp };
    await db.execute(sql, binds);
    console.log("OTP inserted successfully");
  } catch (err) {
    console.error("Error inserting OTP: ", err);
    throw err;
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (err) {
        console.error("Error closing OracleDB db: ", err);
      }
    }
  }
}

async function sendVerificationEmail(EMAIL, otp) {
  try {
    const mailResponse = await mailSender(
      EMAIL,
      "Verification Email",
      EMAILTemplate(otp)
    );
    console.log("Email sent successfully: ", mailResponse.response);
  } catch (error) {
    console.log("Error occurred while sending EMAIL: ", error);
    throw error;
  }
}

// Example function to save an OTP and send an EMAIL
async function saveAndSendOTP(EMAIL, otp) {
  await insertOTP(EMAIL, otp);
  await sendVerificationEmail(EMAIL, otp);
}

// Example function to get OTP by EMAIL
async function getOTPByEmail(EMAIL) {
  let db;
  try {
    db = await connection();
    const sql = `
      SELECT otp_id, EMAIL, otp, created_at, expires_at
      FROM MCSC.OTP
      WHERE EMAIL = :EMAIL
    `;
    const binds = { EMAIL };
    const result = await db.execute(sql, binds);
    return result.rows;
  } catch (err) {
    console.error("Error fetching OTP: ", err);
    throw err;
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (err) {
        console.error("Error closing OracleDB db: ", err);
      }
    }
  }
}

// Function to find OTP by EMAIL
async function findOTP(EMAIL) {
  let db;
  try {
    db = await connection();
    const sql = `SELECT otp FROM MCSC.OTP WHERE "EMAIL" = :val ORDER BY "CREATED_AT" DESC FETCH FIRST 1 ROW ONLY`;
    const res = await db.execute(sql, { val: EMAIL });

    if (res.rows && res.rows.length > 0) {
      console.log("OTP FOUND: ", JSON.stringify(res.rows));
      return res.rows;
    } else {
      console.log("No OTP found for EMAIL:", EMAIL);
      return null;
    }
  } catch (e) {
    console.error("Error finding OTP:", e.message);
    return null;
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (e) {
        console.error("Error closing database connection:", e.message);
      }
    }
  }
}

// Function to find OTP by OTP value
async function findThisOTP(otp) {
  let db;
  try {
    db = await connection();
    const sql = `SELECT otp FROM MCSC.OTP WHERE "otp" = :val`;
    const res = await db.execute(sql, { val: otp });

    if (res.rows && res.rows.length > 0) {
      console.log("OTP FOUND: ", JSON.stringify(res.rows[0]));
      return res.rows[0];
    } else {
      console.log("No OTP found for OTP:", otp);
      return null;
    }
  } catch (e) {
    console.error("Error finding OTP:", e.message);
    return null;
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (e) {
        console.error("Error closing database connection:", e.message);
      }
    }
  }
}

// Function to add OTP for a given EMAIL
async function AddOTP({ otp, EMAIL }) {
  let db;
  try {
    db = await connection();
    const sql = `INSERT INTO MCSC.OTP ("EMAIL", "OTP") VALUES (:v1, :v2)`;
    const res = await db.execute(
      sql,
      { v1: EMAIL, v2: otp },
      { autoCommit: true }
    );

    if (res.rowsAffected && res.rowsAffected === 1) {
      console.log("OTP INSERTED for EMAIL:", EMAIL);
      return { EMAIL, otp };
    } else {
      console.log("Failed to insert OTP for EMAIL:", EMAIL);
      return null;
    }
  } catch (e) {
    console.error("Error adding OTP:", e.message);
    return null;
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (e) {
        console.error("Error closing database connection:", e.message);
      }
    }
  }
}

module.exports = {
  findOTP,
  findThisOTP,
  AddOTP,
  saveAndSendOTP,
  getOTPByEmail,
};
