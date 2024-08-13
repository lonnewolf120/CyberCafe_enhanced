

const {
  getUserDeatails,
  getUser,
  deleteUser,
  updateUserImage,
  getEnrolledCourses,
  getAllStudents,
  getAllInstr,
  updateUser
} = require("../database/origins/User.js");

const {
  uploadImageToCloudinary,
  deleteResourceFromCloudinary,
} = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const { getCourseProgress, courseinfoInstr, getAllCourseDetails, getAllCourseSection, getSubsections, getSubsectionsForSection, getCourses, getCourseDetailsLimited } = require("../database/origins/CourseDB.js");
const { queryWP, query } = require("../database/origins/default.js");

// ================ update Profile ================
exports.updateProfile = async (req, res) => {
  try {
    // extract data
    const {
      GENDER = "",
      DATE_OF_BIRTH = "",
      ABOUT = "",
      CONTACT_NUMBER = "",
      FIRST_NAME,
      LAST_NAME,
    } = req.body;

    // extract USER_ID
    const USER_ID = req.user.id;
    console.log("USER_ID: ", USER_ID)
    // find profile and if profile found continue
    const userDetails = await getUserDeatails(USER_ID);
    // const profileId = userDetails.additionalDetails;
    // const profileDetails = await Profile.findById(profileId);
    if(!userDetails){
      res.status(404).json({
        success: false,
        message: "Cound not find User",
      });
    }
    // TODO: Update the profile fields
    let user = {
      USER_ID: USER_ID,
      FIRST_NAME: FIRST_NAME,
      LAST_NAME: LAST_NAME,
      GENDER: GENDER,
      DATE_OF_BIRTH: DATE_OF_BIRTH,
      ABOUT: ABOUT,
      CONTACT_NUMBER: CONTACT_NUMBER,
    };
    console.log("Updated data:",user) 

    const updatedUserDetails = await updateUser(user);
    // console.log('updatedUserDetails -> ', updatedUserDetails);

    // return response
    res.status(200).json({
      success: true,
      updatedUserDetails,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log("Error while updating profile");
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while updating profile",
    });
  }
};

// ================ delete Account ================
exports.deleteAccount = async (req, res) => {
  try {
    // extract user id
    const USER_ID = req.user.id;
    // console.log('USER_ID = ', USER_ID)

    // TODO: validation
    const userDetails = await getUser(USER_ID);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete user profile picture From Cloudinary
    await deleteResourceFromCloudinary(userDetails.image);

    // if any student delete their account && enrollded in any course then ,
    // student entrolled in particular course sholud be decreae by one
    // user - courses - studentsEnrolled
    const userEnrolledCoursesId = userDetails.courses;
    console.log("userEnrolledCourses ids = ", userEnrolledCoursesId);

    // for (const COURSE_ID of userEnrolledCoursesId) {
    //     await Course.findByIdAndUpdate(COURSE_ID, {
    //         $pull: { studentsEnrolled: USER_ID }
    //     })
    // }

    // // TODO: first - delete profie (profileDetails)
    // await Profile.findByIdAndDelete(userDetails.additionalDetails);

    // // TODO: second - delete account
    // await User.findByIdAndDelete(USER_ID);

    const delres = await deleteUser(USER_ID);
    console.log("from profule.js, delete user: :", delres);
    // sheduale this deleting account , crone job

    // return response
    if (delres) {
      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } else {
      console.log("Error while deleting user");
      console.log(error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error while deleting profile",
      });
    }
  } catch (error) {
    console.log("Error while deleting profile");
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while deleting profile",
    });
  }
};

// ================ get details of user ================
exports.getUserDetails = async (req, res) => {
  try {
    // extract USER_ID
    const USER_ID = req.user.id;
    console.log("from profile.js: id - ", USER_ID);

    // TODO: get user details
    const userDetails = await getUserDeatails(USER_ID);

    // return response
    res.status(200).json({
      success: true,
      data: userDetails,
      message: "User data fetched successfully",
    });
  } catch (error) {
    console.log("Error while fetching user details");
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while fetching user details",
    });
  }
};

// ================ Update User profile Image ================
exports.updateUserProfileImage = async (req, res) => {
  try {
    const profileImage = req.files?.profileImage;
    const USER_ID = req.user.id;

    // validation
    console.log('profileImage = ', profileImage)

    // upload imga eto cloudinary
    const image = await uploadImageToCloudinary(
      profileImage,
      process.env.CLOUDINARY_FOLDER_NAME,
      1000,
      1000
    );

    console.log('image res from cloudinary - ', image);

    // TODO: update in DB
    const updatedUserDetails = await updateUserImage(
      image.secure_url,
      USER_ID
    );

    // success response
    res.status(200).json({
      success: true,
      message: `Image Updated successfully`,
      data: updatedUserDetails,
    });
  } catch (error) {
    console.log("Error while updating user profile image");
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while updating user profile image",
    });
  }
};

// ================ Get Enrolled Courses ================
exports.getEnrolledCourses = async (req, res) => {
  try {
    //FIXME: cannot set undefined (setting sections)
    //TODO: replace with PLSQL
    const USER_ID = req.user.id;
    console.log("USer (getEnrolledCourses): ", USER_ID)
    //TODO:
    let userDetails = await query(`SELECT COURSE_ID FROM MCSC.Course_StudentsEnrolled WHERE STUDENT_ID = :studentid`, {studentid: USER_ID}, "Failed to fetch student info (getEnrolledCourses,profile.js)", "got enrolled courses info");
    console.log("userDetails from profile.js: ", userDetails);
    // userDetails = userDetails.toObject();

    // TODO: INSIDE COURSE THERE WILL BE SECTION AND INSIDE SECTION THERE WILL BE SUBSECTION, USE PL/SQL TO GET SUCH RESULT
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.length; i++) {
     let totalDurationInSeconds = 0;
      let courseProgress = await getCourseProgress(
        userDetails[i].COURSE_ID,
        USER_ID);
      //Add the course here
      let courseDetails = await getAllCourseDetails(userDetails[i].COURSE_ID)
      userDetails[i].course = courseDetails;
      
      //Sections, subsections not added
      //Add all course subsections
      // await courseDetails.map(async (course, index)=>{
      //   console.log("traversing course: ", course.COURSE_ID)
      //   let sections = await getSubsectionsForSection(course.COURSE_ID)
      //   console.log(`Section of ${course.COURSE_ID}: `, sections)
      //   courseDetails[index].sections = sections;
      // })

      let courseProgressCount = courseProgress?.completed_videos;
      SubsectionLength = courseProgress?.total_videos;

      if (SubsectionLength === 0) {
        userDetails[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${USER_ID}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// ================ instructor Dashboard ================
exports.instructorDashboard = async (req, res) => {
  try {
    //TODO:
    const courseDetails = await courseinfoInstr(req.user.id);
    console.log("FROM PROFILE.JS: Course Details: ", courseDetails)

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.SOLD;  
      const totalAmountGenerated = totalStudentsEnrolled * course.PRICE;
      // Create a new object with the additional fields
      const courseDataWithStats = {
        COURSE_ID: course.COURSE_ID,
        COURSE_NAME: course.COURSE_NAAME,
        COURSE_DESCRIPTION: course.COURSE_DESCRIPTION,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    res.status(200).json({
      courses: courseData,
      message: "Instructor Dashboard Data fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================ get All Students ================
exports.getAllStudents = async (req, res) => {
  try {
    //TODO:
    const allStudentsDetails = await getAllStudents();

    console.log("Student info (profile.js, getAllStudents): ", allStudentsDetails);
    //FIXME: probable err, check return type
    const studentsCount = allStudentsDetails.length || 0; 

    res.status(200).json({
      allStudentsDetails,
      studentsCount,
      message: "All Students Data fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while fetching all students",
      error: error.message,
    });
  }
};

// ================ get All Instructors ================
exports.getAllInstructors = async (req, res) => {
  try {
    //TODO:
    const allInstructorsDetails = await getAllInstr(); //FIXME:RETURNING NULL (even when there's instructors)

    console.log("instr info (profile.js, getAllInstructors): ", allInstructorsDetails);
    //FIXME: probable err, check return type
    const instructorsCount = allInstructorsDetails?.length || 0; 

    res.status(200).json({
      allInstructorsDetails,
      instructorsCount,
      message: "All Instructors Data fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while fetching all Instructors",
      error: error.message,
    });
  }
};
