// const Course = require('../models/course');
// const User = require('../models/user');
// const Category = require('../models/category');
// const Section = require('../models/section')
// const SubSection = require('../models/subSection')
// const CourseProgress = require('../models/courseProgress')
const { findUSER_ID, findInstructor } = require("../database/origins/User");
const {
  addCourse,
  getCourses,
  getPubCourses,
  addCourseToCat,
  insertCourseToinstr,
  getAllCourseDetails,
  getCourseProgress,
  getCourseTimeDuration,
  getAllCoursebyInstr,
  deleteCourse,
  getAllStudentsEnrolled,
  getAllCourseSection,
  getSubsectionsForSection
} = require("../database/origins/CourseDB");
const { showAllCat, findCat } = require("../database/origins/Cat.js");

const {
  uploadImageToCloudinary,
  deleteResourceFromCloudinary,
} = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const { connection } = require("../database/database.js");

// ================ create new course ================
exports.createCourse = async (req, res) => {
  try {
    // extract data
    const {
      COURSE_NAME,
      COURSE_DESCRIPTION,
      WHAT_YOU_WILL_LEARN,
      PRICE,
      category,
      INSTRUCTIONS: _INSTRUCTIONS,
      status,
      tag,
    } = req.body;

    // Convert the tag and INSTRUCTIONS from stringified Array to Array
    // const tag = (_tag);
    const INSTRUCTIONS = JSON.parse(_INSTRUCTIONS);

    // console.log("tag = ", tag)
    // console.log("INSTRUCTIONS = ", INSTRUCTIONS)

    // get THUMBNAIL of course
    console.log("thumbnail url: ", req.files?.THUMBNAIL)
    const thumbNail = (req.files?.THUMBNAIL)? req.files?.THUMBNAIL : "/hacking.png" ;

    // validation
    if (
      !COURSE_NAME ||
      !COURSE_DESCRIPTION ||
      !WHAT_YOU_WILL_LEARN ||
      !PRICE ||
      !category ||
      !thumbNail ||
      !INSTRUCTIONS.length ||
      !tag.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fileds are required",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }

    // check current user is instructor or not , bcoz only instructor can create
    // we have insert user id in req.user , (payload , while auth )
    const instructorId = req.user.id;
     //get user only if ACCOUNT_TYPE is equal to 'Instructor', if yes take the id
     const instructorDetails = await findInstructor(instructorId);
    
     if (!instructorDetails) {
       return res.status(404).json({
         success: false,
         message: "Instructor Details Not Found",
       })
     }

    // check given category is valid or not
    const categoryDetails = await findCat(category);
    if (!categoryDetails) { 
      return res.status(401).json({
        success: false,
        message: "Category Details not found",
      });
    }

    // if(!THUMBNAILDetails.secure_url)
         
    // upload thumbNail to cloudinary
    let THUMBNAILDetails = await uploadImageToCloudinary(
      thumbNail,
      process.env.CLOUDINARY_FOLDER_NAME
    );

    console.log("Cloudinary response: ", THUMBNAILDetails)
  
    if(!THUMBNAILDetails)THUMBNAILDetails = {
      secure_url:"https://res.cloudinary.com/dauafquys/image/upload/v1721931097/z9uwocm9s9nhon7n52i2.png"
    };

    console.log("course2.js: from Cloudinary-> secure_url: ", THUMBNAILDetails)
    // create new course - entry in DB
    const newCourse = await addCourse(
        COURSE_NAME,
        COURSE_DESCRIPTION,
        instructorId,
        WHAT_YOU_WILL_LEARN,
        PRICE,
        tag,
        categoryDetails.CATEGORY_ID,
        THUMBNAILDetails.secure_url,
        status,
        INSTRUCTIONS,
    );
    console.log("course2.js: newCourse: ", newCourse)
    // add course id to instructor courses list, this is bcoz - it will show all created courses by instructor
    await insertCourseToinstr(newCourse.data.COURSE_ID, instructorId);

    // Add the new course to the Categories
    await addCourseToCat(categoryDetails.CATEGORY_ID, newCourse.data.COURSE_ID);

    // return response
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "New Course created successfully",
    });
  } catch (error) {
    console.log("Error while creating new course");
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while creating new course",
    });
  }
};

// ================ show all courses ================
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await getPubCourses();

    return res.status(200).json({
      success: true,
      data: allCourses,
      message: "Data for all courses fetched successfully",
    });
  } catch (error) {
    console.log("Error while fetching data of all courses");
    console.log(error);
    res.status(500).json({
      success: false,
      error: error,
      message: "Error while fetching data of all courses",
    });
  }
};

// ================ Get Course Details ================
exports.getCourseDetails = async (req, res) => {
  try {
    // get course ID
    const { COURSE_ID } = req.body;

    // find course details
    let courseDetails = await getAllCourseDetails(COURSE_ID);

    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${COURSE_ID}`,
      });
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    console.log('courseDetails -> ', courseDetails)
    
    let durationMin = await getCourseTimeDuration(COURSE_ID);
    console.log('durationMin -> ', durationMin)
    const totalDuration = convertSecondsToDuration(Number(durationMin)*60);

    //return response
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
      message: "Fetched course data successfully",
    });
  } catch (error) {
    console.log("Error while fetching course details");
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while fetching course details",
    });
  }
};

// ================ Get Full Course Details ================
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { COURSE_ID } = req.body;
    const USER_ID = req.user.id;
    console.log('COURSE_ID = ', COURSE_ID, " User ID = ", USER_ID)

    // COURSE -> SECTION -> SUBSECTION

    const courseDetails = await getAllCourseDetails(COURSE_ID);

    console.log("from course2.js, full courseDetails: ", courseDetails)

    // const allsections = await getSubsectionsForSection(COURSE_ID);

    // console.log("section details (course2.js): ", allsections);

    // courseDetails[0].sections = (allsections);

    // console.log("Full course details: ", courseDetails)

    let cpc = await getCourseProgress(COURSE_ID, USER_ID); //completed_videos, total_videos, completion_ratio
    
    let courseProgressCount={};
    
    courseProgressCount.completed_videos = cpc.COMPLETED_VIDEOS;
    courseProgressCount.total_videos = cpc[0].total.TOTAL_VIDEOS;
    courseProgressCount.total_completed= cpc[0].TOTAL_COMPLETED; 
    let durationMin = cpc[0].total.DURATION
    const totalDuration = (durationMin*60);
    
    console.log("courseProgressCount : ", courseProgressCount)
    

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find course with id: ${COURSE_ID}`,
      });
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completed_videos
          ? courseProgressCount?.completed_videos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};


exports.getEnrolledStudents = async (req, res) => {
  try{
    const {COURSE_ID} = req.body
    const allStudents = await getAllStudentsEnrolled(COURSE_ID);
    console.log("getEnrolledStudents API RESPONSE: ",`All students of the course with course id ${COURSE_ID}: `, allStudents)

    if(allStudents){
    return res.status(200).json({
      success: true,
      data: {
        allStudents,
        COURSE_ID,
      },
    });
    }
    return res.status(404).json({
      success: false,
      message: "No students found for the course"
    });
  }
  catch(err){
    return res.status(500).json({
      success: false,
      message: err.message,
      error: err
    });
  }
};

// ================ Edit Course Details ================
/*
exports.editCourse = async (req, res) => {
  try {
    const { COURSE_ID } = req.body;
    const updates = req.body;
    const course = await Course.findById(COURSE_ID);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If thumbNail Image is found, update it
    if (req.files) {
      // console.log("thumbNail update")
      const thumbNail = req.files.THUMBNAIL;
      const THUMBNAIL = await uploadImageToCloudinary(
        thumbNail,
        process.env.CLOUDINARY_FOLDER_NAME
      );
      course.thumbNail = THUMBNAIL.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "INSTRUCTIONS") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    // updatedAt
    course.updatedAt = Date.now();

    //   save data
    await course.save();

    const updatedCourse = await Course.findOne({
      _id: COURSE_ID,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // success response
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating course",
      error: error.message,
    });
  }
};
*/
exports.editCourse = async (req, res) => {
  let db;

  try {
    const { COURSE_ID } = req.body;
    const updates = req.body;
    console.log("Req body: ",req.body);
    console.log("Req PARAMS: ",req.params);

    db = await connection();

    // Fetch the course
    console.log("course id:", COURSE_ID)
    let result = await db.execute(
      `SELECT * FROM MCSC.Courses WHERE course_id = :COURSE_ID`,
      { COURSE_ID: COURSE_ID }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    let course = result.rows[0];

    // If thumbNail Image is found, update it
    if (req.files && req.files.THUMBNAIL) {
      const thumbNail = req.files.THUMBNAIL;
      const THUMBNAIL = await uploadImageToCloudinary(
        thumbNail,
        process.env.CLOUDINARY_FOLDER_NAME
      );
      updates.THUMBNAIL = (THUMBNAIL.secure_url)? THUMBNAIL.secure_url: "/hacking.png";
    }

    // Update only the fields that are present in the request body
    let updateFields = [];
    let bindVars = { COURSE_ID };

    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "INSTRUCTIONS") {
          updates[key] = JSON.parse(updates[key]);
        }
        if (key === "THUMBNAIL"){
          updateFields.push(`${key} = :${key}`);
          bindVars[key] = updates[key];
        }
        else{
          updateFields.push(`${key} = :${key}`);
          bindVars[key] = updates[key];
        }
      }
    }

    
    // Update the updatedAt field
    // updateFields.push(`updatedAt = :updatedAt`);
    // bindVars.updatedAt = new Date();

    // Create the update SQL statement
    const updateSql = `UPDATE MCSC.Courses SET ${updateFields.join(", ")} WHERE course_id = :COURSE_ID`;
    
    // Execute the update
    await db.execute(updateSql, bindVars);

    // Commit the transaction
    await db.commit();
// Fetch the updated course
    const updatedCourseSql = `
      SELECT c.*, i.first_name || ' ' || i.last_name AS instructor_name, cat.name AS category_name
      FROM MCSC.Courses c
      JOIN MCSC.Users i ON c.instructor = i.user_id
      JOIN MCSC.Category cat ON c.category = cat.category_id
      LEFT JOIN MCSC.RatingAndReviews r ON c.course_id = r.course_id
      WHERE c.course_id = :COURSE_ID
    `;
    result = await db.execute(updatedCourseSql, { COURSE_ID });
    const updatedCourse = result.rows;

    // Success response
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating course",
      error: error,
    });
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
exports.fetchAfterEdit = async(req, res)=>{
    const fn=`
    CREATE OR REPLACE FUNCTION get_course_details(p_course_id IN MCSC.Courses.course_id%TYPE)
RETURN SYS_REFCURSOR
IS
    -- Declare a variable to hold the cursor (REF CURSOR type)
    course_cursor SYS_REFCURSOR;
BEGIN
    -- Open the cursor and execute the query
    OPEN course_cursor FOR
        SELECT c.course_id, c.course_name AS course_name,
               i.fullname AS instructor_name,
               cat.name AS category_name,
               COUNT(r.rating) AS rating_count,
               AVG(r.rating) AS average_rating
          FROM MCSC.Courses c
          JOIN MCSC.Users i ON c.instructor = i.user_id
          JOIN MCSC.Category cat ON c.category = cat.category_id
          LEFT JOIN MCSC.RatingAndReviews r ON c.course_id = r.course_id
          WHERE c.course_id = p_course_id
          GROUP BY c.course_id, c.course_name, i.fullname, cat.name;
    
    -- Return the cursor to the caller
    RETURN course_cursor;
END get_course_details;
/

    `
    // PL/SQL block to call the function and retrieve the REF CURSOR
    const plsql = `
      DECLARE
        v_course_cursor SYS_REFCURSOR;
      BEGIN
        -- Call the PL/SQL function and pass the course_id
        v_course_cursor := get_course_details(:course_id);
        -- Return the cursor result set
        OPEN :cursor FOR SELECT * FROM TABLE(v_course_cursor);
      END;
    `;

    // Create a bind variable for the course ID and the cursor
    const binds = {
      course_id: courseId,  // The course ID to filter on
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }  // Define cursor output
    };

    // Execute the PL/SQL block
    const result = await connection.execute(plsql, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    // Fetch the cursor data
    const resultSet = result.outBinds.cursor;
    let row;
    const courseDetails = [];

    // Loop through the cursor and fetch all rows
    while ((row = await resultSet.getRow())) {
      courseDetails.push(row);
    }

    // Close the cursor
    await resultSet.close();

    // Return the fetched course details
    return res.json({courseDetails});

}
  // ================ Get a list of Course for a given Instructor ================
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id;

    // Find all courses belonging to the instructor
    const instructorCourses = await getAllCoursebyInstr(instructorId);
    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
      // totalDurationInSeconds:totalDurationInSeconds,
      message: "Courses made by Instructor fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

// ================ Delete the Course ================

exports.deleteCourse = async (req, res) => {
  try {
    const { COURSE_ID } = req.body;

    // Find the course
    const course = await getCourses(COURSE_ID);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const del = await deleteCourse(COURSE_ID);

    
    // delete course THUMBNAIL From Cloudinary
    await deleteResourceFromCloudinary(course?.THUMBNAIL);

    if(del){
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    }

  }catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while Deleting course",
      error: error,
    });
  }
}
/*
exports.deleteCourse = async (req, res) => {
  try {
    const { COURSE_ID } = req.body;

    // Find the course
    const course = await getCourses(COURSE_ID);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: COURSE_ID },
      });
    }

    // delete course THUMBNAIL From Cloudinary
    await deleteResourceFromCloudinary(course?.THUMBNAIL);

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const SUBSECTION_ID of subSections) {
          const subSection = await SubSection.findById(SUBSECTION_ID);
          if (subSection) {
            await deleteResourceFromCloudinary(subSection.videoUrl); // delete course videos From Cloudinary
          }
          await SubSection.findByIdAndDelete(SUBSECTION_ID);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(COURSE_ID);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while Deleting course",
      error: error.message,
    });
  }
};
*/