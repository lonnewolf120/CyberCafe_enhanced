const { connection } = require("../database.js");
const { query, queryWP } = require("./default.js");
const oracledb = require("oracledb");

async function addCategory(name, desc) {
  let db;
  const sql = `INSERT INTO MCSC.Category (name, description) VALUES(:v1, :v2)`;
  try {
    db = await connection(); // Await connection
    const res = await db.execute(sql, { v1: name, v2: desc }); // Await execute
    if (res) {
      console.log("Category inserted successfully", res);
      await db.commit();
      return res;
    }
  } catch (e) {
    console.log("Error from Cat.js (addCategory)");
    console.log("And the error: " + e.message);
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
async function deleteCategory(id) {
  let db;
  const sql = `DELETE FROM MCSC.Category WHERE CATEGORY_ID = :v1`;
  try {
    db = await connection(); // Await connection
    const res = await db.execute(sql, { v1: id }); // Await execute
    if (res) {
      console.log("Category deleted successfully");
      return res.rows;
    }
  } catch (e) {
    console.log("Error from Cat.js (deleteCategory)");
    console.log("And the error: " + e.message);
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
async function findCat(id) {
  return await query(
    `SELECT * FROM MCSC.CATEGORY WHERE CATEGORY_ID = :v1`,
    { v1: id },
    "Failed to find category",
    "Category found"
  );
}

async function showAllCat() {
  //FIXME update here or in frontend
  const sql = `SELECT * FROM MCSC.CATEGORY `;
  return (categories = await queryWP(
    sql,
    "Cat.js: Failed to fetch all categories",
    "showAllCat: All selected"
  ));
}
async function showAllCourses() {
  //FIXME update here or in frontend
  const sql = `SELECT * FROM MCSC.COURSES `;
  return await queryWP(
    sql,
    "Cat.js: Failed to fetch all courses",
    "showAllCourses: All courses"
  );
}
async function showAllCat2() {
  // Fetch all categories (if needed separately)
  const sql = `SELECT * FROM MCSC.CATEGORY`;
  const categories = await queryWP(
    sql,
    "Cat.js: Failed to fetch all categories",
    "showAllCat: All categories selected"
  );

  // Fetch all courses with their respective categories using the view
  const sql2 = `SELECT * FROM MCSC.CATEGORY_COURSES_VIEW`;
  const courses = await queryWP(
    sql2,
    "Failed to fetch all courses with categories",
    "All courses with categories fetched"
  );

  // TODO: Add ratings for every course if needed
  return { categories, courses };
}


async function showCourseForCat(name) {
  console.log("name : ", name);
  const sql = `SELECT
    "A2"."CATEGORY_ID"         "CATEGORY_ID",
    "A2"."NAME"                "CAT_NAME",
    "A2"."DESCRIPTION"         "CAT_DESCRIPTION",
    "A2"."COURSES"             "COURSES",
    "A1"."COURSE_ID"           "COURSE_ID",
    "A1"."COURSE_NAME"         "COURSE_NAME",
    "A1"."COURSE_DESCRIPTION"  "COURSE_DESCRIPTION",
    "A1"."INSTRUCTOR"          "INSTRUCTOR",
    "A1"."WHAT_YOU_WILL_LEARN" "WHAT_YOU_WILL_LEARN",
    "A1"."PRICE"               "PRICE",
    "A1"."THUMBNAIL"           "THUMBNAIL",
    "A1"."STATUS"              "STATUS",
    "A1"."CREATED_AT"          "CREATED_AT",
    "A1"."SOLD"                "SOLD",
    "A1"."TAG"                 "TAG",
    "A1"."INSTRUCTIONS"        "INSTRUCTIONS",
    "A1"."POINTS"              "POINTS",
    AVG(R.RATING)              "AVG_RATING",
    COUNT(R.COURSE_ID)         "TOTAL_RATING"       
FROM
    "MCSC"."CATEGORY" "A2",
    "MCSC"."COURSES"  "A1",
    MCSC.RATINGANDREVIEWS R 
WHERE
    "A2"."CATEGORY_ID" = "A1"."CATEGORY"
    AND A2.NAME = :v1 AND A1.COURSE_ID = R.COURSE_ID (+)
group by "A2"."CATEGORY_ID", "A2"."NAME", "A2"."DESCRIPTION", "A2"."COURSES", "A1"."COURSE_ID", 
"A1"."COURSE_NAME", "A1"."COURSE_DESCRIPTION", "A1"."INSTRUCTOR", "A1"."WHAT_YOU_WILL_LEARN", "A1"."PRICE", 
"A1"."THUMBNAIL", "A1"."STATUS", "A1"."CREATED_AT", "A1"."SOLD", "A1"."TAG", 
"A1"."INSTRUCTIONS", "A1"."POINTS"`;
  let db;
  try {
    db = await connection(); // Await connection
    const res = await db.execute(sql, { v1: name }); // Await execute
    if (res) {
      console.log("Category FOUND");
      return res.rows;
    }
  } catch (e) {
    console.log("Error from Cat.js (showCourseForCat)");
    console.log("And the error: " + e.message);
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

async function showCatWithCourse(id, f = 1) {
  if (f) {
    const sql = `
    SELECT c.course_id AS "COURSE_ID", c.course_name AS "COURSE_NAME", c.THUMBNAIL, C.CATEGORY AS "CATEGORY_ID", 
    c.course_description AS "COURSE_DESCRIPTION", c.PRICE, c.STATUS, c.CREATED_AT, c.TAG, c.INSTRUCTIONS, c.POINTS, c.WHAT_YOU_WILL_LEARN, c.SOLD,
    i.first_name || ' ' || i.last_name AS "INSTRUCTOR_NAME", i.IMAGE AS "INSTRUCTOR_IMAGE",
    ROUND(AVG(R.RATING),3) AS AVG_RATING, COUNT(R.COURSE_ID) AS TOTAL_RATING
    FROM MCSC.Courses c, MCSC.Category cat, MCSC.USERS I, MCSC.RATINGANDREVIEWS R 
    WHERE c.category = cat.category_id AND I.USER_ID = C.INSTRUCTOR 
    AND cat.category_id = :v1 AND c.status = 'Published' AND C.COURSE_ID = R.COURSE_ID (+)
    group by c.course_id, c.course_name, c.THUMBNAIL, C.CATEGORY, c.course_description, 
    c.PRICE, c.STATUS, c.CREATED_AT, c.TAG, c.INSTRUCTIONS, 
    c.POINTS, c.WHAT_YOU_WILL_LEARN, c.SOLD, i.first_name || ' ' || i.last_name, i.IMAGE`;
    let cat = await query(
      sql,
      { v1: id },
      `Failed to fetch for Category ${id} query from showCatWithCourse() in Cat.js`,
      "Category with Courses fetched"
    );
    const sql2 = `
    SELECT *
    FROM MCSC.RATINGANDREVIEWS  
    WHERE CATEGORY_ID = :b1`;
    const ratings = await query(
      sql2,
      { b1: id },
      `Failed to fetch ratings for the category ${id}`,
      `Ratings fetched successfully for cat ${id}`
    );
    cat.ratings = ratings;
    return cat;
  } else {
    const sql = `
    SELECT c.course_id AS "COURSE_ID", c.course_name AS "COURSE_NAME", c.THUMBNAIL, C.CATEGORY AS "CATEGORY_ID", 
    c.course_description AS "COURSE_DESCRIPTION", c.PRICE, c.STATUS, c.CREATED_AT, c.TAG, c.INSTRUCTIONS, c.POINTS, c.WHAT_YOU_WILL_LEARN, c.SOLD,
    i.first_name || ' ' || i.last_name AS "INSTRUCTOR_NAME", i.IMAGE AS "INSTRUCTOR_IMAGE", ROUND(AVG(R.RATING),3) AS AVG_RATING, COUNT(R.COURSE_ID) AS TOTAL_RATING
    FROM MCSC.Courses c, MCSC.Category cat, MCSC.USERS I, MCSC.RATINGANDREVIEWS R 
    WHERE c.category = cat.category_id AND I.USER_ID = C.INSTRUCTOR 
    AND cat.category_id <> :v1 AND c.status = 'Published' AND C.COURSE_ID = R.COURSE_ID (+)
    group by c.course_id, c.course_name, c.THUMBNAIL, C.CATEGORY, c.course_description, 
    c.PRICE, c.STATUS, c.CREATED_AT, c.TAG, c.INSTRUCTIONS, 
    c.POINTS, c.WHAT_YOU_WILL_LEARN, c.SOLD, i.first_name || ' ' || i.last_name, i.IMAGE
    `;
    let cat = await query(
      sql,
      { v1: id },
      `Failed to fetch for Category ${id} query from showCatWithCourse() in Cat.js`,
      "Category with Courses fetched"
    );
    const sql2 = `
    SELECT *
    FROM MCSC.RATINGANDREVIEWS  
    WHERE CATEGORY_ID <> :b1
    `;

    const ratings = await query(
      sql2,
      { b1: id },
      `Failed to fetch ratings for the category except ${id}`,
      `Ratings fetched successfully for category except ${id}`
    );
    cat.ratings = ratings;
    return cat;
  }
}

async function showCatWithCoursePL(id, f = 1) {
  const plsql = `
  DECLARE
    v1 NUMBER := :id;
    f NUMBER := :flag;

    TYPE t_course_rec IS RECORD (
        COURSE_ID MCSC.Courses.course_id%TYPE,
        COURSE_NAME MCSC.Courses.course_name%TYPE,
        COURSE_DESCRIPTION MCSC.Courses.course_description%TYPE,
        REVIEW MCSC.RatingAndReviews.review%TYPE,
        RATING MCSC.RatingAndReviews.rating%TYPE,
        INSTRUCTOR_NAME VARCHAR2(100),
        INSTRUCTOR_IMAGE VARCHAR2(100)
    );

    TYPE t_course_tab IS TABLE OF t_course_rec INDEX BY PLS_INTEGER;
    courses t_course_tab;

    CURSOR cur_courses IS
        SELECT c.course_id AS COURSE_ID,
               c.course_name AS COURSE_NAME,
               c.course_description AS COURSE_DESCRIPTION,
               r.review AS REVIEW,
               r.rating AS RATING,
               i.first_name || ' ' || i.last_name AS INSTRUCTOR_NAME,
               i.IMAGE AS INSTRUCTOR_IMAGE
          FROM MCSC.Courses c
          JOIN MCSC.Category cat ON c.category = cat.category_id
          JOIN MCSC.USERS i ON i.USER_ID = c.INSTRUCTOR
          LEFT JOIN MCSC.RatingAndReviews r ON c.course_id = r.course_id
         WHERE cat.category_id = v1 AND c.status = 'Published';

    CURSOR cur_courses_except IS
        SELECT c.course_id AS COURSE_ID,
               c.course_name AS COURSE_NAME,
               c.course_description AS COURSE_DESCRIPTION,
               r.review AS REVIEW,
               r.rating AS RATING,
               i.first_name || ' ' || i.last_name AS INSTRUCTOR_NAME,
               i.IMAGE AS INSTRUCTOR_IMAGE
          FROM MCSC.Courses c
          JOIN MCSC.Category cat ON c.category = cat.category_id
          JOIN MCSC.USERS i ON i.USER_ID = c.INSTRUCTOR
          LEFT JOIN MCSC.RatingAndReviews r ON c.course_id = r.course_id
         WHERE cat.category_id <> v1 AND c.status = 'Published';
BEGIN
    IF f = 1 THEN
        OPEN cur_courses;
        FETCH cur_courses BULK COLLECT INTO courses;
        CLOSE cur_courses;
    ELSE
        OPEN cur_courses_except;
        FETCH cur_courses_except BULK COLLECT INTO courses;
        CLOSE cur_courses_except;
    END IF;

    FOR i IN 1 .. courses.COUNT LOOP
        DBMS_OUTPUT.PUT_LINE('Course ID: ' || courses(i).COURSE_ID);
        DBMS_OUTPUT.PUT_LINE('Course Name: ' || courses(i).COURSE_NAME);
        DBMS_OUTPUT.PUT_LINE('Course Description: ' || courses(i).COURSE_DESCRIPTION);
        DBMS_OUTPUT.PUT_LINE('Review: ' || (courses(i).REVIEW));
        DBMS_OUTPUT.PUT_LINE('Rating: ' || (courses(i).RATING));
        DBMS_OUTPUT.PUT_LINE('Instructor Name: ' || courses(i).INSTRUCTOR_NAME);
        DBMS_OUTPUT.PUT_LINE('Instructor Image: ' || courses(i).INSTRUCTOR_IMAGE);
        DBMS_OUTPUT.PUT_LINE('------------------------------');
    END LOOP;
END;
`;
  try {
    const db = await connection();
    // Enable DBMS_OUTPUT
    await db.execute("BEGIN DBMS_OUTPUT.ENABLE(NULL); END;");

    // Execute the PL/SQL block
    await db.execute(plsql, { id, flag: f }, { autoCommit: true });

    // Retrieve the output
    let result = await db.execute(
      `BEGIN DBMS_OUTPUT.GET_LINE(:line, :status); END;`,
      {
        line: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        status: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    let output = "";
    while (result.outBinds.status === 0) {
      output += result.outBinds.line + "\n";
      result = await db.execute(
        `BEGIN DBMS_OUTPUT.GET_LINE(:line, :status); END;`,
        {
          line: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
          status: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
    }

    console.log("Category with Courses fetched using PL/SQL", output);
    return output;
  } catch (err) {
    console.error("Failed to fetch category with courses using PL/SQL", err);
    return null;
  } finally {
    await db.close();
  }
}

async function getMostSellingCourses({ fetchAtmost = 5 }) {
  /*
  WITH PublishedCourses AS (
    SELECT c.course_id, c.course_name, c.course_description, c.sold, c.instructor, c.category
    FROM MCSC.Courses c
    WHERE c.status = 'Published'
    ),
    CourseDetails AS (
    SELECT c.course_id, c.course_name, c.course_description, c.sold, 
            i.first_name || ' ' || i.last_name AS instructor_name,
            cat.name AS category_name
    FROM PublishedCourses c
    JOIN MCSC.Users i ON c.instructor = i.user_id
    JOIN MCSC.Category cat ON c.category = cat.category_id
    )
    SELECT *
    FROM CourseDetails
    ORDER BY sold DESC
    FETCH FIRST :fetchAtmost ROWS ONLY
    */
  let sql = `
    
        SELECT c.course_id, c.course_name, c.course_description, c.sold, c.THUMBNAIL, 
                i.first_name || ' ' || i.last_name AS "INSTRUCTOR_NAME", i.IMAGE AS "INSTRUCTOR_IMAGE",
                cat.name AS category_name, c.PRICE, c.STATUS, c.CREATED_AT, c.TAG, c.INSTRUCTIONS, c.POINTS, c.WHAT_YOU_WILL_LEARN,
                c.SOLD, c.category as "CATEGORY_ID", c.INSTRUCTOR as "INSTRUCTOR_ID",
                ROWNUM as rnum
        FROM MCSC.Courses c, MCSC.Users i, MCSC.Category cat
        WHERE i.user_id = c.instructor AND cat.category_id = c.category AND ROWNUM <= :fetchAtmost
        ORDER BY c.SOLD DESC
    `;

  const course = await query(
    sql,
    { fetchAtmost: fetchAtmost },
    "Failed to fetch All Best selling courses",
    "Fetched most selling courses"
  );
  let r = 0, cnt=0;
  course.map(async (c, ind) => {
    //Fetch ratings for the courses
    sql = `SELECT R.RATING, R.REVIEW, U.USER_ID, U.FIRST_NAME, U.LAST_NAME, 
    U.ACCOUNT_TYPE  FROM MCSC.RATINGANDREVIEWS R, MCSC.USERS U WHERE course_id = :v1 AND U.USER_ID = R.USER_ID`;
    const ratings = await query(
      sql,
      { v1: c.COURSE_ID },
      "Failed to fetch ratings for the course",
      "Ratings fetched successfully"
    );
    r += ratings.RATING;
    cnt++;
    course[ind] = { ...c, ratings };
  });
  course["AVG_RATING"]= r/cnt;
  course["TOTAL_RATING"] = cnt;
  return course;
}

async function getMostSellingCoursesPL({ fetchAtmost = 5 }) {
  const plsql = `
  DECLARE
    -- Cursor to fetch the most selling courses
    CURSOR course_cursor IS
        SELECT c.course_id, c.course_name, c.course_description, c.sold, c.thumbnail, 
               i.first_name || ' ' || i.last_name AS instructor_name,
               i.image AS instructor_image,
               cat.name AS category_name, c.price, c.status, c.created_at, c.tag, 
               c.instructions, c.points, c.what_you_will_learn,
               c.category AS category_id, c.instructor AS instructor_id
        FROM MCSC.Courses c
        JOIN MCSC.Users i ON c.instructor = i.user_id
        JOIN MCSC.Category cat ON c.category = cat.category_id
        WHERE c.status = 'Published'
        ORDER BY c.sold DESC
        FETCH FIRST :fetchAtmost ROWS ONLY;

    TYPE course_table IS TABLE OF course_cursor%ROWTYPE INDEX BY PLS_INTEGER;
    courses course_table;
    idx PLS_INTEGER := 1;

    -- Cursor to fetch ratings for a specific course
    CURSOR rating_cursor(p_course_id NUMBER) IS
        SELECT r.rating, r.review, u.user_id, u.first_name, u.last_name, u.account_type
        FROM MCSC.RatingAndReviews r
        JOIN MCSC.Users u ON r.user_id = u.user_id
        WHERE r.course_id = p_course_id;

    TYPE rating_table IS TABLE OF rating_cursor%ROWTYPE INDEX BY PLS_INTEGER;
BEGIN
    OPEN course_cursor;

    -- Fetch courses into the associative array
    LOOP
        FETCH course_cursor INTO courses(idx);
        EXIT WHEN course_cursor%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE('Course ID: ' || courses(idx).course_id);
        DBMS_OUTPUT.PUT_LINE('Course Name: ' || courses(idx).course_name);
        DBMS_OUTPUT.PUT_LINE('Course Description: ' || courses(idx).course_description);
        DBMS_OUTPUT.PUT_LINE('Instructor Name: ' || courses(idx).instructor_name);
        DBMS_OUTPUT.PUT_LINE('Instructor Image: ' || courses(idx).instructor_image);
        DBMS_OUTPUT.PUT_LINE('Category Name: ' || courses(idx).category_name);
        DBMS_OUTPUT.PUT_LINE('Price: ' || courses(idx).price);
        DBMS_OUTPUT.PUT_LINE('Status: ' || courses(idx).status);
        DBMS_OUTPUT.PUT_LINE('Created At: ' || courses(idx).created_at);
        DBMS_OUTPUT.PUT_LINE('Tag: ' || courses(idx).tag);
        DBMS_OUTPUT.PUT_LINE('Instructions: ' || courses(idx).instructions);
        DBMS_OUTPUT.PUT_LINE('Points: ' || courses(idx).points);
        DBMS_OUTPUT.PUT_LINE('What You Will Learn: ' || courses(idx).what_you_will_learn);
        DBMS_OUTPUT.PUT_LINE('Sold: ' || courses(idx).sold);
        DBMS_OUTPUT.PUT_LINE('Category ID: ' || courses(idx).category_id);
        DBMS_OUTPUT.PUT_LINE('Instructor ID: ' || courses(idx).instructor_id);

        -- Fetch ratings for the current course
        DECLARE
            ratings rating_table;
            r_idx PLS_INTEGER := 1;
        BEGIN
            OPEN rating_cursor(courses(idx).course_id);

            LOOP
                FETCH rating_cursor INTO ratings(r_idx);
                EXIT WHEN rating_cursor%NOTFOUND;
                DBMS_OUTPUT.PUT_LINE('  Rating: ' || ratings(r_idx).rating);
                DBMS_OUTPUT.PUT_LINE('  Review: ' || ratings(r_idx).review);
                DBMS_OUTPUT.PUT_LINE('  User ID: ' || ratings(r_idx).user_id);
                DBMS_OUTPUT.PUT_LINE('  User Name: ' || ratings(r_idx).first_name || ' ' || ratings(r_idx).last_name);
                DBMS_OUTPUT.PUT_LINE('  Account Type: ' || ratings(r_idx).account_type);
                r_idx := r_idx + 1;
            END LOOP;

            CLOSE rating_cursor;
        END;

        idx := idx + 1;
    END LOOP;

    CLOSE course_cursor;
END;
`;
  const db = await connection();
  try {
    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // format the output as JSON-like objects
    };
    const res = await db.execute(plsql, { fetchAtmost: fetchAtmost }, options);
    console.log("Most selling courses fetched using PL/SQL", res);
    return res;
  } catch (err) {
    console.log("Failed to fetch most selling courses using PL/SQL");
    console.error(err);
    return null;
  }
}

module.exports = {
  addCategory,
  showAllCat,
  showAllCat2,
  findCat,
  showCourseForCat,
  showCatWithCourse,
  showCatWithCoursePL,
  getMostSellingCourses,
  getMostSellingCoursesPL,
  deleteCategory,
  showAllCourses,
};
