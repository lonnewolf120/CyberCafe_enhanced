const { connection } = require("../database.js");
const { query, queryWP } = require("./default.js");

async function CreateUser(user) {
  let db;
  try {
    db = await connection();
    const sql = `
        INSERT INTO MCSC.Users (first_name, last_name, EMAIL, CONTACTNUMBER, password, ACCOUNT_TYPE, image)
        VALUES (:first_name, :last_name, :EMAIL, :CONTACT_NUMBER, :password, :ACCOUNT_TYPE, :image)`;

    const res = await db.execute(sql, {
      first_name: user.first_name,
      last_name: user.last_name,
      EMAIL: user.EMAIL,
      CONTACT_NUMBER: user.CONTACT_NUMBER,
      password: user.password,
      ACCOUNT_TYPE: user.ACCOUNT_TYPE,
      image: user.image,
    });

    await db.commit();

    console.log("Created User:", user);
    console.log("Insert result:", res);

    return getUSER_ID(user.EMAIL);
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

async function getUSER_ID(EMAIL) {
  let db;
  try {
    db = await connection();
    const sql = `SELECT "USER_ID" FROM MCSC.USERS WHERE "EMAIL" = :val1`;
    const res = await db.execute(sql, {
      val1: EMAIL,
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

async function getUser(USER_ID) {
  const sql = `SELECT * FROM MCSC.USERS WHERE USER_ID = :USER_ID`;
  const res = await query(
    sql,
    { USER_ID: USER_ID },
    "Failed to find user",
    "user found"
  );
  return res;
}

async function findUser(email){
  sql = `SELECT * FROM MCSC.USERS WHERE email = :email`;
    const res = await query(sql, { email:email }, "User not found", "User found! ");
    return res.rows;
}


async function getUserW(EMAIL) {
  const sql = `SELECT USER_ID, FIRST_NAME,LAST_NAME, IMAGE FROM MCSC.USERS WHERE  EMAIL = :em`;
  const res = await query(sql, { em: EMAIL }, "Failed to find user", "user found");
  return res;
}
async function getUserDeatails(USER_ID) {
  const sql = `
SELECT A3.USER_ID, A3.EMAIL, A3.PASSWORD, A3.ACCOUNT_TYPE, A3.CONTACTNUMBER, A3.ACTIVE, A3.APPROVED, A3.TOKEN, A3.RESET_PASSWORD_EXPIRES, A3.IMAGE, A3.COURSES, A3.COURSE_PROGRESS, A3.LAST_NAME, A3.FIRST_NAME, 
A2.PROFILE_ID, A2.GENDER, A2.DATE_OF_BIRTH, A2.ABOUT, A2.CONTACT_NUMBER,
A4.ACCOUNT_ID, A4.BALANCE
FROM MCSC.USERS A3
LEFT JOIN MCSC.PROFILE A2 ON A2.USER_ID = A3.USER_ID
LEFT JOIN MCSC.ACCOUNT A4 ON A4.USER_ID = A3.USER_ID
WHERE A3.USER_ID = :USER_ID
`;
  let res = await query(
    sql,
    { USER_ID: USER_ID },
    "Failed to find user",
    "user found"
  );
  let res2 = await query(`SELECT A.CONTESTID AS HOSTEDCONTEST, 
    A.HOST_ID FROM MCSC.HOST A WHERE A.USER_ID = :val`,  { val: USER_ID }, `Failed to get host info`, `Host info fetched`);
  if(res2.rows) res.rows[0].host_info = res2.rows;
  return res;
}
async function updateUserImage(imgurl, USER_ID) {
  let sql = `UPDATE MCSC.USERS 
    SET IMAGE = :imgurl
    WHERE USER_ID = :USER_ID
    `;
  const res = await query(
    sql,
    { imgurl: imgurl, USER_ID: USER_ID },
    "Error updating profile image",
    "Profile image updated successfully"
  );
  return res;
}

async function getEnrolledCourses(studentid) {
  const sql = `SELECT COURSE_ID FROM MCSC.Course_StudentsEnrolled WHERE STUDENT_ID = :studentid`;
  const res = await query(
    sql,
    { studentid: studentid },
    "Failed to get enrolled courses",
    "Enrolled courses fetched"
  );
}

async function updateUserPass(token, newPass, USER_ID) {
  const sql = `UPDATE MCSC.USERS
  SET PASSWORD = :newPass,
      TOKEN = :token,
  WHERE USER_ID = :USER_ID`;
  return await query(
    sql,
    { newPass: newPass, token: token, USER_ID: USER_ID },
    "Failed to update pass",
    "updated password"
  );
}

async function updateUser(user) {
  let sql = `UPDATE MCSC.USERS 
    SET FIRST_NAME = :FIRST_NAME,
        LAST_NAME = :LAST_NAME
    WHERE USER_ID = :USER_ID
    `;
  let res = await query(
    sql,
    {
      FIRST_NAME: user.FIRST_NAME,
      LAST_NAME: user.LAST_NAME,
      USER_ID: user.USER_ID,
    },
    "Failed to update user",
    "User updated successfully"
  );

  // if(!res)

  sql = `UPDATE MCSC.Profile 
    SET GENDER = :gn,
        DATE_OF_BIRTH = TO_DATE(:dob, 'YYYY-MM-DD'),
        ABOUT = :ab,
        CONTACT_NUMBER = :CONTACT_NUMBER
    WHERE USER_ID = :USER_ID`;

  let res1 = await query(
    sql,
    {
      gn: user.GENDER,
      dob: user.DATE_OF_BIRTH,
      ab: user.ABOUT,
      CONTACT_NUMBER: user.CONTACT_NUMBER,
      USER_ID: user.USER_ID,
    },
    "Failed to update userProfile",
    "User Profile updated successfully"
  );

  if (!res1) return res1;
  else if(!res) return res;
  else return user;
}

async function deleteUser(USER_ID) {
  //TODO: DELETE USER FROM ALL PLACES ()
  let sql = `DELETE FROM MCSC.USERS WHERE USER_ID = :USER_ID`;
  let res = await query(
    sql,
    { USER_ID: USER_ID },
    "failed to delete user",
    "deleted user successfully"
  );
  return res;
}

async function findUSER_ID(USER_ID, instr = false) {
  let sql;
  if (!instr) {
    //for use in changePassword() in Auth.js
    sql = `SELECT * FROM MCSC.USERS WHERE USER_ID = :USER_ID`;
    const res = await query(sql, { USER_ID }, "User not found", "User found! ");
    return res.rows;
  } else {
    //for use in createCourse() to get instr info in course2.js
    const sql = `SELECT "USER_ID", "FIRST_NAME" || ' '|| "LAST_NAME" AS FULLNAME, "EMAIL" FROM MCSC.USERS WHERE "ACCOUNT_TYPE" = 'Instructor' AND "USER_ID" = :USER_ID`;
    const res = await query(sql, { USER_ID }, "Instr not found", "Instr found! ");
    return res.rows;
  }
}
async function findInstructor(USER_ID) {
  const db = await connection();
  try {
    const sql = `SELECT "USER_ID", "FIRST_NAME" || ' '|| "LAST_NAME" AS FULLNAME, "EMAIL" FROM MCSC.USERS WHERE "ACCOUNT_TYPE" = 'Instructor' AND "USER_ID" = :USER_ID`;
    const res = await db.execute(sql, {
      USER_ID,
    });
    return res;
  } catch (e) {
    console.error("Error finding instr:", e.message);
    return null;
  }
}

async function updatePassword(USER_ID, password) {
  let db;
  try {
    db = await connection();
    const sql = `UPDATE MCSC.USERS SET "PASSWORD" = :val1 WHERE "USER_ID" = :val2`;
    const res = await db.execute(sql, {
      val1: password,
      val2: USER_ID,
    });

    const retrievedUser = res.rowsAffected;
    if (retrievedUser) {
      console.log("Updated User:", retrievedUser);
      return retrievedUser;
    } else {
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

async function LoginUser(user) {
  let db;
  try {
    db = await connection();
    const sql = `SELECT * FROM USERS WHERE "EMAIL" = :val1`;
    const res = await db.execute(sql, {
      val1: user.EMAIL,
    });

    if (res.rows.length === 0) {
      console.log("User not found");
      return null;
    }

    const retrievedUser = res.rows[0];
    console.log(res.rows);

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

async function getAllStudents() {
  const sql = `  SELECT A.USER_ID, A.FIRST_NAME, A.LAST_NAME, A.EMAIL, A.IMAGE, B.CONTACT_NUMBER,  B.GENDER, B.DATE_OF_BIRTH, B.ABOUT , D.COURSE_NAME
  FROM MCSC.USERS A, MCSC.PROFILE B, MCSC.COURSE_STUDENTSENROLLED C, MCSC.COURSES D
  WHERE ACCOUNT_TYPE = 'Student' AND A.USER_ID = B.USER_ID (+)
  AND C.STUDENT_ID (+)= A.USER_ID AND C.COURSE_ID  = D.COURSE_ID(+)
  `; //RIGHT JOIN ON PROFILE, LEFT JOIN ON COURSE_STUDENTSENROLLED, RIGHT JOIN ON COURSES
  return await queryWP(
    sql,
    "Failed to get All student info (profile.js)",
    "got all student info (profile.js)"
  );
}

async function getAllInstr() {
  //TODO: FIX THIS TO GET ALL INSTR INFO ALONG WITH COURSES
  // const sql = `SELECT A.USER_ID, A.FIRST_NAME, A.LAST_NAME, A.EMAIL, A.IMAGE, B.CONTACT_NUMBER,  B.GENDER, B.DATE_OF_BIRTH, B.ABOUT , D.COURSE_NAME
  // FROM MCSC.USERS A, MCSC.PROFILE B, MCSC.INSTRUCTOR C, MCSC.COURSES D
  // WHERE ACCOUNT_TYPE = 'Instructor' AND A.USER_ID = B.USER_ID (+)
  // AND C.INSTR_ID (+)= A.USER_ID AND C.COURSES  = D.COURSE_ID(+)`;
  //RIGHT JOIN ON PROFILE, LEFT JOIN ON COURSE_STUDENTSENROLLED, RIGHT JOIN ON COURSES

  let db,sql;
  try {
    db = await connection();
    sql = `
        SELECT
            "A2"."USER_ID"                "USER_ID",
            "A3"."EMAIL"                  "EMAIL",
            "A3"."ACCOUNT_TYPE"           "ACCOUNT_TYPE",
            "A3"."CONTACTNUMBER"          "CONTACTNUMBER",
            "A3"."ACTIVE"                 "ACTIVE",
            "A3"."APPROVED"               "APPROVED", 
            "A3"."IMAGE"                  "IMAGE",
            "A3"."COURSES"                "COURSES",
            "A3"."COURSE_PROGRESS"        "COURSE_PROGRESS",
            "A3"."LAST_NAME"              "LAST_NAME",
            "A3"."FIRST_NAME"             "FIRST_NAME",
            "A2"."PROFILE_ID"             "PROFILE_ID",
            "A2"."GENDER"                 "GENDER",
            "A2"."DATE_OF_BIRTH"          "DATE_OF_BIRTH",
            "A2"."ABOUT"                  "ABOUT",
            "A2"."CONTACT_NUMBER"         "CONTACT_NUMBER"
        FROM
            "MCSC"."USERS"   "A3",
            "MCSC"."PROFILE" "A2"
        WHERE
            "A3"."USER_ID" = "A2"."USER_ID" AND
            "A3"."ACCOUNT_TYPE" = 'Instructor'`;
    const res = await db.execute(sql);

    if (res.rows.length === 0) {
      console.log("No Instructor found");
      return null;
    }
    let retrievedUser = res.rows;
    console.log("Instructors: ",res.rows);
    // let courseData=[{}]
    
    retrievedUser.map(async (user, index)=>{
    //FIXME:Failed to get courses for instr: 00000012170000806 ERROR:  ORA-00933: SQL command not properly ended
    // Help: https://docs.oracle.com/error-help/db/ora-00933/
      try{
      sql = `SELECT
    "A1"."COURSE_ID"           "COURSE_ID",
    "A1"."COURSE_NAME"         "COURSE_NAME",
    "A1"."COURSE_DESCRIPTION"  "COURSE_DESCRIPTION",
    "A1"."INSTRUCTOR"          "INSTRUCTOR",
    "A1"."WHAT_YOU_WILL_LEARN" "WHAT_YOU_WILL_LEARN",
    "A1"."PRICE"               "PRICE",
    "A1"."THUMBNAIL"           "THUMBNAIL",
    "A1"."STATUS"              "STATUS",
    "A1"."CREATED_AT"          "CREATED_AT",
    "A1"."CATEGORY"            "CATEGORY",
    "A1"."SOLD"                "SOLD",
    "A1"."TAG"                 "TAG",
    "A1"."INSTRUCTIONS"        "INSTRUCTIONS",
    "A1"."POINTS"              "POINTS"
FROM
    "MCSC"."INSTRUCTOR" "A2",
    "MCSC"."COURSES"    "A1"
WHERE
        "A2"."INSTR_ID" = :b1
    AND "A2"."INSTR_ID" = "A1"."INSTRUCTOR"
    AND "A2"."COURSES" = "A1"."COURSE_ID"`
      const result = await db.execute(sql, {b1: user.USER_ID});

      retrievedUser[index].courses = result.rows;
      }
      catch(err){
        console.log(`Failed to get courses for instr: ${user.USER_ID}`, "ERROR: " ,err.message)
      }
    })
    await db.close()
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

  // return await queryWP(
  //   sql,
  //   "Failed to get All Instructor info (profile.js)",
  //   "got all Instructor info (profile.js)"
  // );
}

async function addToken(USER_ID, token, exp) {
  const sql = `insert into mcsc.tokens (USER_ID, TOKEN, EXPIRES_AT) VALUES(:USER_ID, :token, :exp)`;
  return await query(sql, { USER_ID: USER_ID, token: token, exp: exp });
}
async function getToken(token) {
  const sql = `select * from mcsc.tokens where token = :token`;
  return await query(sql, { token: token });
}

module.exports = {
  CreateUser,
  getUser,
  findUser,
  getUserW,
  getUserDeatails,
  getUSER_ID,
  updateUser,
  updateUserImage,
  deleteUser,
  findUSER_ID,
  getEnrolledCourses,
  updatePassword,
  updateUserPass,
  LoginUser,
  getAllStudents,
  getAllInstr,
  findInstructor,
  addToken,
  getToken,
};
