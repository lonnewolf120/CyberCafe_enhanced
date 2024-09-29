// const Rajorpay = require('razorpay');
// const instance = require('../config/rajorpay');
const crypto = require('crypto');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
require('dotenv').config();

const { getCourses, getStudentsEnrolled, insertCourseToUser, getAllStudentsEnrolled } = require('../database/origins/CourseDB');
const { addCourseProgress } = require('../database/origins/CourseSections');
const { getUser } = require('../database/origins/User');
const { createPayment, createPaymentPL } = require('../database/paymentMethods');


// ================ capture the payment and Initiate the order ================
exports.capturePayment = async (req, res) => {

    // extract COURSE_ID & USER_ID
    const { coursesId } = req.body;
    console.log("FROM PAYMENT : REQ ->", req.body);
    console.log("FROM PAYMENTS.JS: coursesId ->", coursesId);
    // console.log('coursesId = ', typeof (coursesId))
    // console.log('coursesId = ', coursesId)

    const USER_ID = req.user.id;


    if (coursesId.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id" });
    }

    let totalAmount = 0;

    for (const course_id of coursesId) {
        let course;
        try {
            //TODO: valid course Details
            course = await getCourses({id: course_id});
            // console.log("The course(payment.js): ", course);
            if (!course[0]) {
                return res.status(404).json({ success: false, message: `Could not find the course with id ${course_id}` });
            }

            // check user already enrolled the course
            // const uid = new mongoose.Types.ObjectId(USER_ID);
            console.log("from payments.js: USER_ID ->", USER_ID);
            const enrolled = await getStudentsEnrolled(course_id, USER_ID);
            console.log("Student enrollment info:", enrolled);
            if(enrolled?.length !== 0) {
                return res.status(400).json({ success: false, message: "Student is already Enrolled" });
            }

            totalAmount += course[0].PRICE;
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message, error: error });
        }
    }

    // create order
    const currency = "BDT";
    const now = new Date(Date.now());
    const formattedDate = `${now.getUTCFullYear()}-${('0' + (now.getUTCMonth() + 1)).slice(-2)}-${('0' + now.getUTCDate()).slice(-2)} ${('0' + now.getUTCHours()).slice(-2)}:${('0' + now.getUTCMinutes()).slice(-2)}:${('0' + now.getUTCSeconds()).slice(-2)}`;
    const options = {
        USER_ID: String(USER_ID),
        COURSES: coursesId,
        AMOUNT: totalAmount,
        DATE: formattedDate,
    }
    console.log("gotta pay total: ", totalAmount, "date: ", options.DATE);
    // initiate payment using Rajorpay
    //FIXME : Replace with BD gateways
    if(totalAmount === 0) {
        res.status(200).json({
            success: true,
            message: "Free course added to cart",
        })
    }
    try {
        //TODO: add the ssl-commerz gateway here
        // const payment = await 

        const payment = await createPayment(options)
        console.log("Payment info (from db): ", payment);
        if (!payment.data) return res.status(500).json({ success: false, message: payment.message});
        //  const paymentResponse = await instance.instance.orders.create(options);

        // Add this to verify payment
        await enrollStudents(coursesId, USER_ID, res);

        res.status(200).json({
            success: true,
            message: payment.message,
            Bought: payment.boughtCourse
        })
    }
    catch (error) {
        console.log("ERROR from capturePayment: ",error.message);
        return res.status(500).json({ success: false, mesage: "Could not Initiate Order", error: error.message });
    }

}



// ================ verify the payment ================
exports.verifyPayment = async (req, res) => {
    // const razorpay_order_id = req.body?.razorpay_order_id;
    // const razorpay_payment_id = req.body?.razorpay_payment_id;
    // const razorpay_signature = req.body?.razorpay_signature;
    // const courses = req.body?.coursesId;
    // const USER_ID = req.user.id;
    console.log(' req.body === ', req.body)

    
    // const sql = `SELECT * FROM MCSC.TRX_HISTORY WHERE TRXID = :trxid`;
    // if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !USER_ID) {
    //     return res.status(400).json({ success: false, message: "Payment Failed, data not found" });
    // }

    // let body = razorpay_order_id + "|" + razorpay_payment_id;
    // const expectedSignature = crypto
    //     .createHmac("sha256", process.env.RAZORPAY_SECRET)
    //     .update(body.toString())
    //     .digest("hex");

    // if (expectedSignature === razorpay_signature) {
    //     //enroll student
    //     await enrollStudents(courses, USER_ID, res);
    //     //return res
    //     return res.status(200).json({ success: true, message: "Payment Verified" });
    // }
    // return res.status(200).json({ success: "false", message: "Payment Failed" });

}


// ================ enroll Students to course after payment ================
const enrollStudents = async (courses, USER_ID, res) => {

    if (!courses || !USER_ID) {
        return res.status(400).json({ success: false, message: "Please Provide data for Courses or USER_ID" });
    }

    for (const COURSE_ID of courses) {
        try {
            //TODO: find the course and enroll the student in it
            const enrolledCourse = await insertCourseToUser(COURSE_ID, USER_ID);

            if (!enrolledCourse) {
                return res.status(500).json({ success: false, message: "Course not Found" });
            }
            // console.log("Updated course: ", enrolledCourse)

            // TODO: Initialize course preogres with 0 percent
            const courseProgress = await addCourseProgress(COURSE_ID, USER_ID);

            //TODO: get enrolled students
            const enrolledStudent = await getStudentsEnrolled(COURSE_ID, USER_ID);

            // console.log("Enrolled student: ", enrolledStudent)

            // Send an EMAIL notification to the enrolled student
            const EMAILResponse = await mailSender(
                enrolledStudent.EMAIL,
                `Successfully Enrolled into ${enrolledCourse.COURSE_NAME}`,
                courseEnrollmentEmail(enrolledCourse.COURSE_NAME, `${enrolledStudent.FIRST_NAME}`)
            )
            // console.log("Email Sent Successfully", EMAILResponse);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

}



exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;

    const USER_ID = req.user.id;

    if (!orderId || !paymentId || !amount || !USER_ID) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    try {
        // TODO: find student
        const enrolledStudent = await getUser(USER_ID);
        await mailSender(
            enrolledStudent.EMAIL,
            `Payment Recieved`,
            paymentSuccessEmail(`${enrolledStudent.FIRST_NAME}`,
                amount / 100, orderId, paymentId)
        )
    }
    catch (error) {
        console.log("error in sending mail", error)
        return res.status(500).json({ success: false, message: "Could not send EMAIL" })
    }
}


// ================ verify Signature ================
// exports.verifySignature = async (req, res) => {
//     const webhookSecret = '12345678';

//     const signature = req.headers['x-rajorpay-signature'];

//     const shasum = crypto.createHmac('sha256', webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest('hex');


//     if (signature === digest) {
//         console.log('Payment is Authorized');

//         const { COURSE_ID, USER_ID } = req.body.payload.payment.entity.notes;

//         try {
//             const enrolledCourse = await Course.findByIdAndUpdate({ _id: COURSE_ID },
//                 { $push: { studentsEnrolled: USER_ID } },
//                 { new: true });

//             // wrong upper ?

//             if (!enrolledCourse) {
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Course not found'
//                 });
//             }

//             // add course id to user course list
//             const enrolledStudent = await User.findByIdAndUpdate(USER_ID,
//                 { $push: { courses: COURSE_ID } },
//                 { new: true });

//             // send enrolled mail

//             // return response
//             res.status(200).json({
//                 success: true,
//                 message: 'Signature Verified and Course Added'
//             })
//         }

//         catch (error) {
//             console.log('Error while verifing rajorpay signature');
//             console.log(error);
//             return res.status(500).json({
//                 success: false,
//                 error: error.messsage,
//                 message: 'Error while verifing rajorpay signature'
//             });
//         }
//     }

//     else {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid signature'
//         });
//     }
// }