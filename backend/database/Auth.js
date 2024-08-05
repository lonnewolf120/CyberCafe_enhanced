const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
//TODO: uncomment after testing done
// const mailSender = require("../utils/mailSender");
// const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const connection = require('../database/database.js');
const { CreateUser, getUSER_ID, findUSER_ID, updatePassword } = require("./origins/User.js");
const { findOTP, findThisOTP, AddOTP } = require("./origins/OTP.js");
const { findUserProfile } = require("./origins/Profile.js");
const dotenv = require("dotenv");
dotenv.config();

const signup = async function(req, res) {
  try {
    // Destructure fields from the request body
    const {
      FIRST_NAME,
      LAST_NAME,
      EMAIL,
      password,
      confirmPassword,
      ACCOUNT_TYPE,
      CONTACT_NUMBER,
      otp,
    } = req.body;

    // Check if All Details are there or not
    if (
      !FIRST_NAME ||
      !LAST_NAME ||
      !EMAIL ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    // Check if user already exists
    const existingUser = await getUSER_ID({ EMAIL });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Find the most recent OTP for the EMAIL
    const otpQuery = await findOTP({ EMAIL });
    console.log(otpQuery);
    if (!otpQuery || otp !== otpQuery[0].otp) {
      // OTP not found or invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    let approved = "";
    approved = (ACCOUNT_TYPE === "Instructor") ? false : true;

    const user = {
        FIRST_NAME: FIRST_NAME,
        LAST_NAME: LAST_NAME,
        EMAIL: EMAIL,
        CONTACT_NUMBER: CONTACT_NUMBER,
        password: hashedPassword,
        ACCOUNT_TYPE: ACCOUNT_TYPE,
        approved: approved,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${FIRST_NAME}${LAST_NAME}`
    };
    const createdUser = await CreateUser(user);

    // Create the Additional Profile For User
    const prof = {
        USER_ID: createdUser.user_id,
        GENDER: null,
        DATE_OF_BIRTH: null,
        ABOUT: null,
        CONTACT_NUMBER: null,
    };
    const profileDetails = await createProfile(prof);

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
}

// Login controller for authenticating users
const login = async function(req, res) {
  try {
    // Get EMAIL and password from request body
    const { EMAIL, password } = req.body;

    // Check if EMAIL or password is missing
    if (!EMAIL || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user with provided EMAIL
    const user = await findUserProfile(EMAIL);

    // If user not found with provided EMAIL
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    // Compare Passwords
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { EMAIL: user.EMAIL, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // Save token to user document in database
      user.token = token;
      user.password = undefined;

      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
}

// Send OTP For Email Verification
const sendotp = async function(req, res) {
  try {
    const { EMAIL } = req.body;

    // Check if user is already present
    const checkUserPresent = await getUSER_ID(EMAIL);
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await findThisOTP(otp);
    console.log("OTP", otp);
    console.log("Result", result);

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await findThisOTP(otp);
    }

    const otpBody = await AddOTP({ EMAIL: EMAIL, otp: otp });
    console.log("OTP Body", otpBody);

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// Controller for Changing Password
const changePassword = async function(req, res) {
  try {
    const userDetails = await findUSER_ID(req.user.id);
    const { oldPassword, newPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await updatePassword(req.user.id, encryptedPassword);

    // Send notification EMAIL
    try {
      const EMAILResponse = await mailSender(
        updatedUserDetails.EMAIL,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.EMAIL,
          `Password updated successfully for ${updatedUserDetails.FIRST_NAME} ${updatedUserDetails.LAST_NAME}`
        )
      );
      console.log("Email sent successfully:", EMAILResponse.response);
    } catch (error) {
      console.error("Error occurred while sending EMAIL:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending EMAIL",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
}

module.exports = {
  signup,
  login,
  sendotp,
  changePassword
};
