const { connection } = require("../database.js");
const { getUSER_ID } = require("./User.js");

async function createProfile(input) {
    const sql = `INSERT INTO MCSC.PROFILE (user_id, GENDER, date_Of_Birth, ABOUT, contact_Number) VALUES (:v0, :v1, :v2, :v3, :v4)`;
    let db;
    try {
        db = await connection();
        const res = await db.execute(sql, {
            v0: input.USER_ID,
            v1: input.GENDER,
            v2: input.DATE_OF_BIRTH,
            v3: input.ABOUT,
            v4: input.CONTACT_NUMBER
        });
        await db.commit();
        console.log("Profile created");
        return res;
    } catch (e) {
        console.error("Profile failed to create");
        console.error("Error:", e.message);
        return null;
    } finally {
        if (db) {
            try {
                await db.close();
            } catch (e) {
                console.error("Error:", e.message);
            }
        }
    }
}

async function findUserProfile(EMAIL) {
    // const uid = await getUSER_ID(EMAIL); // Ensure to await getUSER_ID, assuming it returns a promise
    // console.log("The uid: ",uid)
    const sql = `
        SELECT 
            "A2"."USER_ID", "A2"."FIRST_NAME", "A2"."LAST_NAME", "A2"."EMAIL", "A2"."PASSWORD", "A2"."ACCOUNT_TYPE", "A2"."ACTIVE",
            "A2"."APPROVED", "A2"."TOKEN", "A2"."RESET_PASSWORD_EXPIRES", "A2"."IMAGE", "A2"."COURSES", "A2"."COURSE_PROGRESS", "A2"."CONTACTNUMBER",
            "A1"."PROFILE_ID", "A1"."GENDER", "A1"."DATE_OF_BIRTH", "A1"."ABOUT", "A1"."CONTACT_NUMBER"
        FROM
            "MCSC"."USERS" "A2",
            "MCSC"."PROFILE" "A1"
        WHERE
            "A2"."EMAIL" = :val
            AND "A2"."USER_ID" = "A1"."USER_ID"`;
    let db;
    try {
        db = await connection();
        const res = await db.execute(sql, { val: EMAIL });
        if (res.rows.length > 0) {
            console.log("User profile found!");
            return res.rows[0];
        } else {
            console.log("User profile not found");
            return null;
        }
    } catch (e) {
        console.error("Error:", e.message);
        return null;
    } finally {
        if (db) {
            try {
                await db.close();
            } catch (e) {
                console.error("Error:", e.message);
            }
        }
    }
}

module.exports = {
    createProfile,
    findUserProfile
};
