const { query, queryWP, queryR } = require("./default.js");
const { connection } = require("../database.js");
const oracledb = require("oracledb");

async function addCourse(
  COURSE_NAME,
  COURSE_DESCRIPTION,
  instructor,
  WHAT_YOU_WILL_LEARN,
  PRICE,
  tag,
  category,
  THUMBNAIL,
  status,
  INSTRUCTIONS
) {
  let db;
  try {
    db = await connection();
    // Begin transaction
    // await db.execute("BEGIN");

    // PL/SQL block for inserting the new course and getting the course_id
    const result = await db.execute(
      `
  
DECLARE
  v_course_id MCSC.Courses.course_id%TYPE;
  v_instructor_exists NUMBER;
BEGIN
  -- Check if the instructor exists in the parent table
  SELECT COUNT(*) INTO v_instructor_exists 
  FROM MCSC.Users 
  WHERE user_id = :instructor;
  
  -- If instructor does not exist, raise an error
  IF v_instructor_exists = 0 THEN
    RAISE_APPLICATION_ERROR(-20001, 'Instructor ID does not exist in the parent table.');
  END IF;
  
  INSERT INTO MCSC.Courses (
    course_name,
    course_description,
    instructor,
    what_you_will_learn,
    PRICE,
    TAG,
    category,
    THUMBNAIL,
    status,
    INSTRUCTIONS
  ) VALUES (
    :COURSE_NAME,
    :COURSE_DESCRIPTION,
    :instructor,
    :WHAT_YOU_WILL_LEARN,
    :PRICE,
    :tag,
    :category,
    :THUMBNAIL,
    :status,
    :INSTRUCTIONS
  )
  RETURNING course_id INTO v_course_id;
  
  :newCourseId := v_course_id;
END;
`,
      {
        COURSE_NAME,
        COURSE_DESCRIPTION,
        instructor,
        WHAT_YOU_WILL_LEARN,
        PRICE,
        tag: tag, // Ensure tag is a comma-separated string
        category,
        THUMBNAIL,
        status,
        INSTRUCTIONS: INSTRUCTIONS, // Ensure INSTRUCTIONS is a comma-separated string
        newCourseId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      }
    );
    console.log("results from course creation: ", result);
    const newCOURSE_ID = result.outBinds.newCourseId;

    // Commit transaction
    await db.execute("COMMIT");

    console.log("Course Created Successfully with ID:", newCOURSE_ID);

    return {
      success: true,
      data: {
        COURSE_ID: newCOURSE_ID,
        COURSE_NAME,
        COURSE_DESCRIPTION,
        instructor,
        WHAT_YOU_WILL_LEARN,
        PRICE,
        tag,
        category,
        THUMBNAIL,
        status,
        INSTRUCTIONS,
      },
      message: "Course Created Successfully",
    };
  } catch (error) {
    // Rollback transaction in case of error
    // if (db) {
    //   await db.execute("ROLLBACK");
    // }
    console.error("Failed to create course:", error);
    return {
      success: false,
      message: "Failed to create course",
      error: error.message,
    };
  } finally {
    // Close the db
    // if (db) {
    //   await db.close();
    // }
  }
}

async function deleteCourse(COURSE_ID) {
  let sql = ` 
      DECLARE
          v_course_id NUMBER := :course_id;
      BEGIN
          -- Delete from RatingAndReviews
          DELETE FROM MCSC.RatingAndReviews WHERE course_id = v_course_id;
          
          -- Delete from CourseProgress
          DELETE FROM MCSC.CourseProgress WHERE course_id = v_course_id;
          
          -- Delete from SubSection
          DELETE FROM MCSC.SubSection WHERE course_id = v_course_id;
          
          -- Delete from Section
          DELETE FROM MCSC.Section WHERE course_id = v_course_id;
          
          -- Unenroll students from Course_StudentsEnrolled
          DELETE FROM MCSC.Course_StudentsEnrolled WHERE course_id = v_course_id;
          
          -- Finally, delete the course from Courses table
          DELETE FROM MCSC.Courses WHERE course_id = v_course_id;

          COMMIT;
      END;`;
  res = await query(
    sql,
    { COURSE_ID },
    "Failed to delete course",
    "Deleted course"
  );
}

async function addCourseToCat(COURSE_ID, categoryId) {
  const sql = `UPDATE MCSC.CATEGORY SET COURSES = CASE WHEN COURSES IS NULL THEN :COURSE_ID ELSE COURSES || ',' || :COURSE_ID END WHERE CATEGORY_ID = :categoryId`;
  let res = await query(
    sql,
    { COURSE_ID, categoryId },
    "Failed to insert course to category",
    "Inserted course to category"
  );
  console.log(res);

  const sql2 = `INSERT INTO MCSC.COURSES (COURSE_ID, CATEGORY) VALUES (:COURSE_ID, :categoryId)`;
  res = await query(
    sql,
    { COURSE_ID, categoryId },
    "Failed to insert course to category",
    "Inserted course to category"
  );
  console.log(res);
  return res;
}

async function insertCourseToinstr(COURSE_ID, instructorId) {
  let sql = `INSERT INTO MCSC.Instructor(INSTR_ID, COURSES) VALUES (:instruct, :COURSE_ID)`;
  let res = await query(
    sql,
    { COURSE_ID: COURSE_ID, instruct: instructorId },
    `Failed to insert course to instructor with Course ID: ${COURSE_ID} and Instructor ID: ${instructorId}`,
    "Inserted course to instructor"
  );
  console.log(res);
  return res;
}

async function insertCourseToUser(COURSE_ID, studentId) {
  let sql = `INSERT INTO MCSC.Course_StudentsEnrolled(COURSE_ID, STUDENT_ID) VALUES (:COURSE_ID, :studentId)`;
  let res = await query(
    sql,
    { COURSE_ID: COURSE_ID, studentId: studentId },
    "Failed to insert course to Users",
    "Inserted course to Users"
  );
  console.log(res);

  sql = `UPDATE MCSC.Users
       SET courses = CASE WHEN courses IS NULL THEN :COURSE_ID
                          ELSE courses || ',' || :COURSE_ID
                     END
       WHERE user_id = :studentId`;
  let res1 = await query(
    sql,
    { COURSE_ID: COURSE_ID, studentId: studentId },
    "Failed to insert course to User",
    "Inserted course to User"
  );
  console.log(res1);

  if (!res1) return res;
  else
    return {
      result1: res,
      result2: res1,
    };
}

async function getAllStudentsEnrolled(COURSE_ID) {
  let sql = `SELECT
    A2.COURSE_ID         ,
    A2.STUDENT_ID      ,
    A1.USER_ID          ,
    A1.EMAIL            , 
    A1.ACCOUNT_TYPE     ,
    A1.CONTACTNUMBER     ,
    A1.ACTIVE            ,
    A1.APPROVED          ,
    A1.IMAGE             ,
    A1.COURSE_PROGRESS   ,
    A1.LAST_NAME         ,
    A1.FIRST_NAME        
FROM
    MCSC.COURSE_STUDENTSENROLLED A2,
    MCSC.USERS                   A1
WHERE
        A2.COURSE_ID = :b1
    AND A2.STUDENT_ID = A1.USER_ID
`;
  let res = await query(
    sql,
    { b1: COURSE_ID },
    `Failed to get all enrolled students in Course ID: ${COURSE_ID}`,
    `Got all enrolled students in course ID: ${COURSE_ID}`
  );
  return res;
}

async function getStudentsEnrolled(COURSE_ID, studentId) {
  let sql = `SELECT * FROM MCSC.Course_StudentsEnrolled WHERE COURSE_ID = :COURSE_ID AND STUDENT_ID = :studentId`;
  let res = await query(
    sql,
    { COURSE_ID: COURSE_ID, studentId: studentId },
    `Failed to get students enrolled wwith Course ID: ${COURSE_ID} and Student ID: ${studentId}`,
    "Got all enrolled student"
  );
  // console.log(res);
  // sql = `UPDATE MCSC.COURSES
  // SET SOLD = SOLD + 1
  // WHERE COURSE_ID = :COURSE_ID
  // `;
  // res = await query(
  //   sql,
  //   { COURSE_ID: COURSE_ID },
  //   "Failed to increment course",
  //   "Incremented course"
  // );
  // console.log(res);

  return res;
}

async function sellDataInstr(instrId) {
  const sql = `SELECT SUM(PRICE), COUNT(*)  FROM MCSC.COURSES A, MCSC.INSTRUCTOR B WHERE A.COURSE_ID = B.COURSES AND A.INSTRUCTOR = :instrId`;
  const res = await query(sql, { instrId: instrId });
  return res;
}

async function getCourses({ id = -1 }) {
  if (id < 0) {
    const sql = `SELECT * FROM MCSC.COURSES`;
    const res = await queryWP(
      sql,
      "Failed to fetch all courses (nb from getCourses func)",
      "Fetched all courses"
    );
    console.log(res);
    return res;
  } else {
    const sql = `SELECT * FROM MCSC.COURSES  WHERE COURSE_ID = :id`;
    const res = await query(
      sql,
      { id },
      "Failed to fetch the course no" + id + " (nb from getCourses func)",
      "Fetched all courses"
    );
    console.log(res);
    return res;
  }
}

async function getCourseTimeDuration(COURSE_ID) {
  const sql = `SELECT 
CASE WHEN SUM(time_duration) IS NULL THEN 0
     ELSE SUM(time_duration)
END AS "DURATION"
FROM MCSC.SUBSECTION WHERE COURSE_ID = :COURSE_ID`;
  const res = await query(
    sql,
    { COURSE_ID: COURSE_ID },
    "Failed to fetch course duration",
    "Fetched course duration"
  );
  return res;
}


async function getAllCourseDetails(COURSE_ID) {
  // Fetch course details
  let sql = ` SELECT
    "A1"."COURSE_ID",
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
    "A1"."POINTS"              "POINTS",
    U.FIRST_NAME,
    U.LAST_NAME,
    U.IMAGE,
    U.EMAIL
FROM
    "MCSC"."COURSES" "A1",
    MCSC.INSTRUCTOR I,
    MCSC.USERS U
WHERE
    "A1"."COURSE_ID" = :COURSE_ID AND
    I.COURSES = A1.COURSE_ID AND
    U.USER_ID = I.INSTR_ID`;
  /// LEFT JOIN on SubSections table and RIGHT JOIN on RatingsAndReviews table, and 2 natural joins with instructor table and users table

  let courseDetails = await query(
    sql,
    { COURSE_ID: COURSE_ID },
    "Failed to fetch course details",
    "Fetched course details "
  );

  sql = `SELECT * FROM MCSC.RATINGANDREVIEWS WHERE COURSE_ID = :COURSE_ID`;
  let rating = await query(
    sql,
    { COURSE_ID: COURSE_ID },
    `Failed to get rating for course ${COURSE_ID}`,
    `fetched rating for course ${COURSE_ID}`
  );

  // Fetch all section data
  sql = `select * from mcsc.section where course_id = :courseId`;
  let sections = await query(
    sql,
    { courseId: COURSE_ID },
    `Failed to get course section for course ${COURSE_ID}`,
    `fetched course section for course ${COURSE_ID}`
  );
  console.log(
    `FROM DATABASE (All Sections for course: ${COURSE_ID}): `,
    sections
  );

  // Fetch all subsection for all the sections
  for (let i = 0; i < sections?.length; ++i) {
    sql = `SELECT * FROM MCSC.SUBSECTION WHERE SECTION_ID = :SECTION_ID AND COURSE_ID = :COURSE_ID`;
    console.log(
      "Trying to fetch subsections for section: ",
      sections[i].SECTION_ID
    );
    const res = await query(
      sql,
      { SECTION_ID: sections[i].SECTION_ID, COURSE_ID: COURSE_ID },
      `Failed to get subsection for course ${sections[i].SECTION_ID}`,
      `fetched subsection for course ${sections[i].SECTION_ID}`
    );
    console.log(
      `FROM DATABASE: SUBSECTION for section ${sections[i].SECTION_ID}: `,
      res
    );
    if(res) sections[i].subSection = res;
    console.log(`sections ${i}: `, sections[i]);
  }
  if(rating) courseDetails[0].ratings = rating;
  if(sections) courseDetails[0].sections = sections;

  console.log("FROM DATABASE, COURSE ALL DETAILS: ", courseDetails);
  return courseDetails;
}

async function getCourseDetailsLimited(COURSE_ID, fetchAtmost = 1) {
  // Fetch course details
  let sql = ` SELECT
    "A1"."COURSE_ID",
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
    "A1"."POINTS"              "POINTS",
    R.RATING,
    R.REVIEW,
    U.FIRST_NAME,
    U.LAST_NAME,
    U.IMAGE,
    U.EMAIL
FROM
    "MCSC"."COURSES" "A1",
    MCSC.RATINGANDREVIEWS R,
    MCSC.INSTRUCTOR I,
    MCSC.USERS U
WHERE
    "A1"."COURSE_ID" = :COURSE_ID AND
    A1.COURSE_ID = R.COURSE_ID (+) AND
    I.COURSES = A1.COURSE_ID AND
    U.USER_ID = I.INSTR_ID
    `;
  /// LEFT JOIN on SubSections table and RIGHT JOIN on RatingsAndReviews table, and 2 natural joins with instructor table and users table

  let courseDetails = await query(
    sql,
    { COURSE_ID: COURSE_ID },
    "Failed to fetch course details LIMITED",
    "Fetched course details LIMITED"
  );

  // Fetch all section data
  sql = `select * from mcsc.section where course_id = :courseId  FETCH FIRST :fetch ROWS ONLY`;
  let sections = await query(
    sql,
    { courseId: COURSE_ID, fetch: fetchAtmost },
    `Failed to get course section for course ${COURSE_ID} LIMITED`,
    `fetched course section for course ${COURSE_ID} LIMITED`
  );
  console.log(
    `FROM DATABASE (All Sections for course: ${COURSE_ID}): `,
    sections
  );

  // Fetch all subsection for all the sections
  for (let i = 0; i < sections.length; ++i) {
    sql = `SELECT * FROM MCSC.SUBSECTION WHERE SECTION_ID = :SECTION_ID AND COURSE_ID = :COURSE_ID 
    FETCH FIRST :fetch ROWS ONLY`;
    console.log(
      "Trying to fetch subsections for section: ",
      sections[i].SECTION_ID
    );
    const res = await query(
      sql,
      {
        SECTION_ID: sections[i].SECTION_ID,
        COURSE_ID: COURSE_ID,
        fetch: fetchAtmost,
      },
      `Failed to get subsection for course ${sections[i].SECTION_ID}`,
      `fetched subsection for course ${sections[i].SECTION_ID}`
    );
    console.log(
      `FROM DATABASE: SUBSECTION for section ${sections[i].SECTION_ID}: `,
      res
    );
    sections[i].subSection = res;
    console.log(`sections ${i}: `, sections[i]);
  }

  courseDetails[0].sections = sections;

  console.log("FROM DATABASE, COURSE ALL DETAILS: ", courseDetails);
  return courseDetails;
}

async function getPubCourses() {
  const sql = 
  `SELECT A.COURSE_ID, a.course_name, A.COURSE_DESCRIPTION, A.WHAT_YOU_WILL_LEARN, A.CATEGORY, A.TAG, A.INSTRUCTIONS,
  A.instructor, U.first_name AS "FIRST_NAME",
  U.last_name AS "LAST_NAME", U.image, U.EMAIL, A.PRICE, A.THUMBNAIL, 
  ROUND(AVG(B.Rating), 3) AS "RATING", COUNT(C.STUDENT_ID) AS "studentsEnrolled", COUNT(C.STUDENT_ID) AS "SOLD" 

  FROM MCSC.COURSES A, 
  MCSC.Users U, MCSC.RATINGANDREVIEWS B, MCSC.Course_StudentsEnrolled C 
  WHERE A.STATUS = 'Published' 
  AND A.COURSE_ID = B.COURSE_ID(+) 
  AND A.instructor (+) = U.user_id
  AND C.COURSE_ID (+) = A.COURSE_ID 

  group by A.COURSE_ID, a.course_name, A.COURSE_DESCRIPTION, A.SOLD, A.WHAT_YOU_WILL_LEARN, 
  A.CATEGORY, A.TAG, A.INSTRUCTIONS, A.instructor, U.first_name, 
  U.last_name, U.image, U.EMAIL, A.PRICE, A.THUMBNAIL 

  ORDER BY A.SOLD DESC `;

  const res = await queryWP(
    sql,
    "Failed to fetch Published courses",
    "Fetched all published courses"
  );
  console.log("from getPubCourses: ", res);
  return res;
}

async function getCourseProgress(COURSE_ID, studentId) {
  //TODO: for subsection, check from array of subsection
  let sql = `SELECT 
    COUNT(P.COURSE_ID) AS total_completed
FROM 
    MCSC.COURSEPROGRESS P
WHERE 
    P.COURSE_ID = :COURSE_ID
    AND P.USER_ID = :studentId
  `;
  let courseProgress = await query(
    sql,
    { COURSE_ID: COURSE_ID, studentId: studentId },
    "Failed to fetch course progress",
    "Fetched all course progress"
  );

  console.log("Course progress (1/3): ", courseProgress);

  sql = `SELECT  
    COUNT(S.video_url) AS total_videos,
    SUM(S.TIME_DURATION) AS DURATION
    FROM 
        MCSC.SUBSECTION S
    WHERE 
        S.COURSE_ID = :COURSE_ID
    `;
  let total_count = await query(
    sql,
    { COURSE_ID: COURSE_ID },
    "Failed to fetch course progress",
    "Fetched total courses"
  );

  // console.log("Course progress (2/3): ", total_count)
  courseProgress[0].total = total_count[0];
  console.log("from getCourseProgress: ", courseProgress);

  sql = `SELECT COMPLETED_VIDEOS, SECTION_ID, SUBSECTION_ID FROM MCSC.COURSEPROGRESS
   WHERE COURSE_ID = :COURSE_ID AND USER_ID = :studentId`;
  const progress = await query(
    sql,
    { COURSE_ID: COURSE_ID, studentId: studentId },
    "Failed to fetch course progress",
    "Fetched all course progress"
  );
  // console.log("ALL progress from getCourseProgress: ", progress);
  courseProgress.COMPLETED_VIDEOS = progress;

  console.log("from getCourseProgress: ", courseProgress);
  return courseProgress;
}

async function getAllCourseSection(COURSE_ID) {
  const sql = `select * from mcsc.section where course_id = :courseId`;
  const res = await query(
    sql,
    { courseId: COURSE_ID },
    `Failed to get course section for course ${COURSE_ID}`,
    `fetched course section for course ${COURSE_ID}`
  );
  return res;
}

async function getSubsections(COURSE_ID) {
  const sql = `select * from mcsc.subsection where course_id = :courseId`;
  const res = await query(
    sql,
    { courseId: COURSE_ID },
    `Failed to get course subsection for course ${COURSE_ID}`,
    `fetched course subsection for course ${COURSE_ID}`
  );
  return res;
}

async function getSubsectionsForSection(COURSE_ID) {
  //TODO: REPLACE ALL THIS WITH PL/SQL
  let sql = `select * from mcsc.section where course_id = :courseId`;
  let sections = await query(
    sql,
    { courseId: COURSE_ID },
    `Failed to get course section for course ${COURSE_ID}`,
    `fetched course section for course ${COURSE_ID}`
  );
  console.log(
    `FROM DATABASE (All Sections for course: ${COURSE_ID}): `,
    sections
  );
  for (let i = 0; i < sections.length; ++i) {
    sql = `SELECT * FROM MCSC.SUBSECTION WHERE SECTION_ID = :SECTION_ID AND COURSE_ID = :COURSE_ID`;
    console.log(
      "Trying to fetch subsections for section: ",
      sections[i].SECTION_ID
    );
    res = await query(
      sql,
      { section_id: sections[i].SECTION_ID, course_id: COURSE_ID },
      `Failed to get subsection for course ${sections[i].SECTION_ID}`,
      `fetched subsection for course ${sections[i].SECTION_ID}`
    );
    console.log(
      `FROM DATABASE: SUBSECTION for section ${sections[i].SECTION_ID}: `,
      res
    );
    sections[i].subSection = res;
    console.log(`sections ${i}: `, sections[i]);
  }
  return sections;
};

async function getSubsectionsForSectionPL(COURSE_ID){

  const db = await connection();
  try{
   // Enable DBMS_OUTPUT
   await db.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);

   // PL/SQL block to be executed
   const plsql = `
       DECLARE
           p_course_id NUMBER := :COURSE_ID;
           -- SECTION
           v_section_id MCSC.SECTION.SECTION_ID%TYPE;
           v_section_name MCSC.SECTION.SECTION_NAME%TYPE;
           v_subsection_id MCSC.SECTION.SUBSECTION_ID%TYPE;
           v_course_id MCSC.SECTION.COURSE_ID%TYPE;

           -- SUBSECTION  
           v_title MCSC.SUBSECTION.TITLE%TYPE;
           V_TIME MCSC.SUBSECTION.TIME_DURATION%TYPE;
           V_DESC MCSC.SUBSECTION.DESCRIPTION%TYPE;
           V_VIDEO MCSC.SUBSECTION.VIDEO_URL%TYPE;

           -- Cursor to fetch sections
           CURSOR section_cursor IS
               SELECT SECTION_ID, SECTION_NAME, COURSE_ID, SUBSECTION_ID
               FROM MCSC.SECTION
               WHERE COURSE_ID = p_course_id;

           -- Cursor to fetch subsections for a specific section
           CURSOR subsection_cursor IS
               SELECT SUBSECTION_ID, TITLE, TIME_DURATION, DESCRIPTION, VIDEO_URL
               FROM MCSC.SUBSECTION
               WHERE SECTION_ID = v_section_id
               AND COURSE_ID = p_course_id;

       BEGIN
           -- Loop through each section
           OPEN section_cursor;
           LOOP
               FETCH section_cursor INTO v_section_id, v_section_name, v_course_id, v_subsection_id;
               EXIT WHEN section_cursor%NOTFOUND;

               -- Output section details
               DBMS_OUTPUT.PUT_LINE('Section ID: ' || v_section_id || ' | Section Name: ' || v_section_name);

               -- Loop through each subsection within the section
               OPEN subsection_cursor;
               LOOP
                   FETCH subsection_cursor INTO v_subsection_id, v_title, V_TIME, V_DESC, V_VIDEO;
                   EXIT WHEN subsection_cursor%NOTFOUND;

                   -- Output subsection details
                   DBMS_OUTPUT.PUT_LINE('  Subsection ID: ' || v_subsection_id || ' | Subsection Name: ' || v_title || ' | Time Duration: ' || V_TIME || ' | Description: ' || V_DESC || ' | Video URL: ' || V_VIDEO);
               END LOOP;
               CLOSE subsection_cursor;

           END LOOP;
           CLOSE section_cursor;

       END;
   `;

   // Execute the PL/SQL block
   await db.execute(plsql, { COURSE_ID: courseId });

   // Fetch and print DBMS_OUTPUT
   let result;
   do {
       result = await db.execute(
           `BEGIN DBMS_OUTPUT.GET_LINES(:lines, :numlines); END;`,
           {
               lines: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32767, maxArraySize: 1000 },
               numlines: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: 1000 }
           }
       );
       for (let i = 0; i < result.outBinds.lines.length; i++) {
           console.log(result.outBinds.lines[i]);
       }
   } while (result.outBinds.numlines > 0);

} catch (err) {
   console.error('Error:', err);
} finally {
   if (db) {
       try {
           await db.close();
       } catch (err) {
           console.error('Error closing db:', err);
       }
   }
}
}



async function getAllCoursebyInstr(instrId) {
  const sql = `SELECT * FROM MCSC.INSTRUCTOR I, MCSC.COURSES c WHERE  I.INSTR_ID = :instrId AND C.COURSE_ID = I.COURSES`;
  const res = await query(
    sql,
    { instrId },
    "Failed to fetch all courses by instructor",
    "Fetched all courses by instructor"
  );
  return res;
}

async function courseinfoInstr(instrId) {
  const sql = `
    SELECT A.COURSE_ID, A.COURSE_NAME, A.COURSE_DESCRIPTION, A.SOLD, A.PRICE, B.INSTR_ID
    FROM MCSC.COURSES A, MCSC.INSTRUCTOR B, MCSC.COURSE_STUDENTSENROLLED C WHERE A.COURSE_ID = B.COURSES AND A.INSTRUCTOR = :instrId 
    AND A.COURSE_ID = C.COURSE_ID`;
  const res = await query(
    sql,
    { instrId: instrId },
    "Failed to fetch all courses by instructor",
    "Fetched all courses by instructor"
  );
  return res;
}

module.exports = {
  addCourse,
  getCourses,
  getPubCourses,
  getCourseTimeDuration,
  getAllCourseDetails,
  addCourseToCat,
  insertCourseToinstr,
  getAllCoursebyInstr,
  getCourseProgress,
  getAllCourseSection,
  getSubsections,
  insertCourseToUser,
  getStudentsEnrolled,
  getAllStudentsEnrolled,
  getSubsectionsForSection,
  getSubsectionsForSectionPL,
  deleteCourse,
  sellDataInstr,
  courseinfoInstr,
  getCourseDetailsLimited,
};
