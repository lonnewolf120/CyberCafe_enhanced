const {
  getCourseProgress,
} = require("../database/origins/CourseDB");
const {
  isSubsectionValid,
  findCourseProgress,
  updCourseProgress,addCourseProgress
} = require("../database/origins/CourseSections");

// ================ update Course Progress ================
exports.updateCourseProgress = async (req, res) => {
  const { COURSE_ID, SUBSECTION_ID } = req.body;
  console.log("courseProgress.js: ", COURSE_ID, SUBSECTION_ID)
  const USER_ID = req.user.id;

  try {
    // Check if the subsection is valid
    const subsection = await isSubsectionValid(SUBSECTION_ID);
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" });
    }

    // Find the course progress document for the user and course
    /* let courseProgress = await getCourseProgress(COURSE_ID, USER_ID);
    
    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
        
      })
    } else {            bn
      // If course progress exists, check if the subsection is already completed
      //TODO: check from array of subsection
      if (courseProgress.SUBSECTION_ID === SUBSECTION_ID ) {
        return res.status(400).json({ error: "Subsection already completed" })
      }

      // Push the subsection into the completedVideos array
      courseProgress.completedVideos.push(SUBSECTION_ID)
    }
    */
    let courseProgress = await updCourseProgress(
      COURSE_ID,
      USER_ID,
      SUBSECTION_ID
    );

    if (!courseProgress) {
      return res.status(400).json({
        success: false,
        message: "Course progress Not Added",
      });
    } else {
      return res.status(200).json({ message: "Course progress updated" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ================ get Progress Percentage ================
// exports.getProgressPercentage = async (req, res) => {
//   const { COURSE_ID } = req.body
//   const USER_ID = req.user.id

//   if (!COURSE_ID) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }

//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       COURSE_ID: COURSE_ID,
//       USER_ID: USER_ID,
//     })
//       .populate({
//         path: "COURSE_ID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()

//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, USER_ID)
//     let lectures = 0
//     courseProgress.COURSE_ID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })

//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100

//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }
