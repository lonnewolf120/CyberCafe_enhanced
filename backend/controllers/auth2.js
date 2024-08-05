// sendOtp , signup , login ,  changePassword
// const User = require('./../models/user');
// const Profile = require('./../models/profile');
const optGenerator = require('otp-generator');
// const OTP = require('../models/OTP')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie = require('cookie');
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mail/templates/EMAILVerificationTemplate');
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
// const {connection} = require('../database/database.js');
const { CreateUser, getUSER_ID, findUSER_ID, updatePassword, findUser } = require("../database/origins/User.js");
const { findOTP, findThisOTP, AddOTP } = require("../database/origins/OTP.js");
const { findUserProfile, createProfile } = require("../database/origins/Profile.js");
const dotenv = require("dotenv");
const { query } = require('../database/origins/default.js');
dotenv.config();
// ================ SEND-OTP For Email Verification ================
exports.sendOTP = async (req, res) => {
    try {

        // fetch EMAIL from re.body 
        const { EMAIL } = req.body;

        // check user already exist ?
        const checkUserPresent = await getUSER_ID(EMAIL);

        // if exist then response
        if (checkUserPresent) {
            console.log('(when otp generate) User alreay registered')
            return res.status(401).json({
                success: false,
                message: 'User is Already Registered'
            })
        }

        // generate Otp
        const otp = optGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        // console.log('Your otp - ', otp);

        const name = EMAIL?.split('@')[0]?.split('.').map(part => part.replace(/\d+/g, '')).join(' ');
        console.log(name);

        // send otp in mail
        await mailSender(EMAIL, 'OTP Verification Email', otpTemplate(otp, name));

        // create an entry for otp in DB
        const otpBody = await  AddOTP({ EMAIL: EMAIL, otp: otp });
        console.log('otpBody - ', otpBody);



        // return response successfully
        res.status(200).json({
            success: true,
            otp,
            message: 'Otp sent successfully'
        });
    }

    catch (error) {
        console.log('Error while generating Otp - ', error);
        res.status(200).json({
            success: false,
            message: 'Error while generating Otp',
            error: error.message
        });
    }
}


// ================ SIGNUP ================
exports.signup = async (req, res) => {
    try {
        // extract data 
        let { FIRST_NAME, LAST_NAME, EMAIL, password, confirmPassword,
            ACCOUNT_TYPE, CONTACT_NUMBER, otp } = req.body;
        console.log("From signup of auth.js:",req.body)
        
        // validation
        if (!FIRST_NAME || !LAST_NAME || !EMAIL || !password || !confirmPassword || !ACCOUNT_TYPE || !otp) {
            return res.status(401).json({
                success: false,
                message: 'All fields are required..!'
            });
        }

        // check both pass matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                messgae: 'passowrd & confirm password does not match, Please try again..!'
            });
        }

        // check user have registered already
        const checkUserAlreadyExits = await getUSER_ID(EMAIL);

        // if yes ,then say to login
        if (checkUserAlreadyExits) {
            return res.status(400).json({
                success: false,
                message: 'User registered already, go to Login Page'
            });
        }

        // find most recent otp stored for user in DB
        const recentOtp = await findOTP(EMAIL);
        // console.log('recentOtp ', recentOtp)

        // if otp not found
        if (!recentOtp || recentOtp.length == 0) {
            console.log("OTP doesn't exist")
            return res.status(400).json({
                success: false,
                message: 'Otp not found in DB, please try again'
            });
        } else if (otp !== recentOtp.OTP) {
            // otp invalid
            console.log("OTP doesn't match", otp, "from db: ", recentOtp.OTP)
            return res.status(400).json({
                success: false,
                message: 'Invalid Otp'
            })
        }
        console.log("OTP MATCHED!")

        // hash - secure passoword
        let hashedPassword = await bcrypt.hash(password, 10);

        let approved = "";
        ACCOUNT_TYPE === "Instructor" ? (approved = false) : (approved = true);

        const user = {
            FIRST_NAME: FIRST_NAME,
            LAST_NAME: LAST_NAME,
            EMAIL: EMAIL,
            CONTACT_NUMBER: CONTACT_NUMBER?CONTACT_NUMBER: '017-xxxx-xxxx',
            password: hashedPassword,
            ACCOUNT_TYPE: ACCOUNT_TYPE,
            approved: approved,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${FIRST_NAME}${LAST_NAME}`
        };
        const createdUser = await CreateUser(user);
        console.log("USER_ID: ", createdUser)
    
        // Create the Additional Profile For User
        const prof = {
            USER_ID: createdUser.USER_ID,
            GENDER: null,
            DATE_OF_BIRTH: null,
            ABOUT: `Profile of ${FIRST_NAME} ${LAST_NAME}`,
            CONTACT_NUMBER: CONTACT_NUMBER,
        };
        const profileDetails = await createProfile(prof);
        console.log("Profile: ", profileDetails)

        // return success message
        res.status(200).json({
            success: true,
            message: 'User Registered Successfully'
        });
    }

    catch (error) {
        console.log('Error while registering user (signup)');
        console.log(error)
        res.status(401).json({
            success: false,
            error: error.message,
            messgae: 'User cannot be registered , Please try again..!'
        })
    }
}


// ================ LOGIN ================
exports.login = async (req, res) => {
    try {
        const { EMAIL, password } = req.body;
        console.log(req.body)

        // validation
        if (!EMAIL || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // check user is registered and saved data in DB
        let user = await  findUserProfile(EMAIL);  
        console.log("user from profile: ", user)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'You are not registered with us'
            });
        }

        // console.log("pass: ", user.PASSWORD)
        // comapare given password and saved password from DB
        await bcrypt.compare(req.body.password, user.PASSWORD)
        .then((check) => {
            if(!check){
                return res.status(401).json({
                    success: false,
                    message: "Password didn't match",
                });
            }
            const payload = {
                EMAIL: user.EMAIL,
                id: user.USER_ID,
                ACCOUNT_TYPE: user.ACCOUNT_TYPE // This will help to check whether user have access to route, while authorzation
            };

            // Generate token 
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });

            // user = user.toObject();
            user.token = token;
            user.PASSWORD = undefined; // we remove password from object, not DB

            // cookie
            const cookieOptions = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
                httpOnly: true
            }

            res.cookie('token', token, cookieOptions).status(200).json({
                success: true,
                user,
                token,
                message: 'User logged in successfully'
            });
        })
        // password not match
        .catch((e)=> {
            return res.status(401).json({
                success: false,
                message: `Error: ${e.message}`,
                error: e
            });
        })
    }

    catch (error) {
        console.log('Error while Login user');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while Login user'
        })
    }
}


// ================ CHANGE PASSWORD ================
exports.changePassword = async (req, res) => {
    try {
        // extract data
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        // console.log("Req body: ", req.user)

        // validation
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: 'All fileds are required'
            });
        }

        // get user
        const userQ = await query(`SELECT * FROM MCSC.USERS WHERE email = :email`, { email:req.user.EMAIL }, "User not found", "User found! ");;
        const userDetails = userQ[0];
        console.log("userdetails: ", userDetails)

        // validate old passowrd entered correct or not
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.PASSWORD
        )

        // if old password not match 
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false, message: "Old password is Incorrect"
            });
        }

        // check both passwords are matched
        if (newPassword !== confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: 'The password and confirm password do not match'
            })
        }


        // hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update in DB
        const updatedUserDetails = await updatePassword(req.user.id, hashedPassword);

        // send EMAIL
        try {
            const EMAILResponse = await mailSender(
                updatedUserDetails.EMAIL,
                'Password for your account has been updated',
                passwordUpdated(
                    updatedUserDetails.EMAIL,
                    `Password updated successfully for ${updatedUserDetails.FIRST_NAME} ${updatedUserDetails.LAST_NAME}`
                )
            );
            console.log("Email sent successfully:", EMAILResponse);
        }
        catch (error) {
            console.error("Error occurred while sending EMAIL:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending EMAIL",
                error: error.message,
            });
        }


        // return success response
        res.status(200).json({
            success: true,
            mesage: 'Password changed successfully'
        });
    }

    catch (error) {
        console.log('Error while changing passowrd');
        console.log(error)
        res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while changing passowrd'
        })
    }
}