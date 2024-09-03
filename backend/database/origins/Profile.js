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
        let sql = `SELECT 
        A.USER_ID, A.FIRST_NAME, A.LAST_NAME, A.EMAIL, A.PASSWORD, A.ACCOUNT_TYPE, A.ACTIVE,
        A.APPROVED, A.TOKEN, A.RESET_PASSWORD_EXPIRES, A.IMAGE, A.COURSES, A.COURSE_PROGRESS, A.CONTACTNUMBER,
        B.PROFILE_ID, B.GENDER, B.DATE_OF_BIRTH, B.ABOUT, B.CONTACT_NUMBER,
        C.ACCOUNT_ID, C.BALANCE
    FROM
        MCSC.USERS A,
        MCSC.PROFILE B,
        MCSC.ACCOUNT C
    WHERE
        A.EMAIL = :val
        AND A.USER_ID = B.USER_ID (+)
        AND A.USER_ID = C.USER_ID (+)
    `;
        let db;
        try {
            db = await connection();
            let res = await db.execute(sql, { val: EMAIL });
            if (res.rows.length > 0) {
                console.log("User profile found!");
                sql = `SELECT A.CONTESTID AS HOSTEDCONTEST, A.HOST_ID FROM MCSC.HOST A WHERE A.USER_ID = :val`;
                const res1 = await db.execute(sql, { val: res.rows[0].USER_ID });
                res.rows[0].host_info = res1.rows;
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
