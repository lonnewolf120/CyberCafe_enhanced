const oracledb = require('oracledb');
const { connection } = require('../database.js');

// Function to find OTP by EMAIL
async function findOTP(EMAIL) {
    let db;
    try {
        db = await connection();
        const sql = `SELECT otp FROM MCSC.OTP WHERE "EMAIL" = :val ORDER BY "CREATED_AT" DESC FETCH FIRST 1 ROW ONLY`;
        const res = await db.execute(sql, { val: EMAIL });
        
        if (res.rows && res.rows.length > 0) {
            console.log("OTP FOUND: ", JSON.stringify(res.rows[0].OTP));
            return res.rows[0];
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
        const res = await db.execute(sql, { v1: EMAIL, v2: otp }, { autoCommit: false });
        
        if (res.rowsAffected && res.rowsAffected === 1) {
            console.log("OTP INSERTED for EMAIL:", EMAIL);
            await db.commit();
            // await db.close();
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
    AddOTP
};
