import {connection} from './database.js'


export async function CreateUser(user) {
    let db;
    try {
        db = await connection();
        const sql = `
        INSERT INTO MCSC.Users (first_name, last_name, email, contactNumber, password, account_type, image)
        VALUES (:first_name, :last_name, :email, :contactNumber, :password, :account_type, :image)`;

        const res = await db.execute(sql, {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            contactNumber: user.contactNumber,
            password: user.password,
            account_type: user.account_type,
            image: user.image
        });
        await db.commit();
        console.log("User:", user);
        console.log("Insert result:", res);

        return res.lastRowid;
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

export async function getUserID(email) {
    let db;
    try {
        db = await connection();
        const sql = `SELECT "USER_ID" FROM MCSC.USERS WHERE "EMAIL" = :val1`;
        const res = await db.execute(sql, {
            val1: email
        });

        if (res.rows.length === 0) {
            console.log("User not found");
            return null;
        }

        const retrievedUser = res.rows[0];
        return retrievedUser;
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

export async function getUser(email){
    const db = await connection();
    let res;
    const sql = `SELECT "USER_ID", "IMAGE", "FIRST_NAME" || "LAST_NAME" AS "FULLNAME" FROM MCSC.USERS WHERE "EMAIL" = :val1`;
    try {
        res = await db.execute(sql, {
            val1: email
        });
        await db.commit();

        if (res.rows.length === 0) {
            console.log("User not found");
            return null;
        }

        const retrievedUser = res.rows[0];
        console.log("from server: USER: ",retrievedUser);
        // console.log("USER FOUND:", retrievedUser.userID, retrievedUser.email, retrievedUser.password);
        
        return retrievedUser;
    } catch (e) {
        console.log("Error:", e.message);
        return null;
    } finally {
        if (db) {
            try {
                await db.close();
            } catch (e) {
                console.log("Error: " + e.message);
            }
        }
    }
}
//TODO: MOVE Tasks info to TaskList
export async function LoginUser(user) {
    const db = await connection();
    const sql = `SELECT * FROM MCSC.USERS WHERE "EMAIL" = :val1`;
    try {
        const res = await db.execute(sql, {
            val1: user.email
        });
        // await db.commit();

        if (res.rows.length === 0) {
            console.log("User not found");
            return null;
        }
        const retrievedUser = res.rows[0];
        console.log(res.rows);
        // console.log(JSON.stringify(retrievedUser))
        // console.log("USER FOUND:", retrievedUser.USER_ID, retrievedUser.EMAIL);
        return retrievedUser;
    } catch (e) {
        console.log("Error:", e.message);
        return null;
    } finally {
        // await db.close();
        // if (db) {
        //     try {
        //         await db.close();
        //     } catch (e) {
        //         console.log("Error: " + e.message);
        //     }
        // }
    }
}
