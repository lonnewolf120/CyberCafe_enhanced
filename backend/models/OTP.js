const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({
    EMAIL: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60, // The document will be automatically deleted after 3 minutes of its creation time
    }

});

//  function to send EMAIL
async function sendVerificationEmail(EMAIL, otp) {
    try {
        const mailResponse = mailSender(EMAIL, 'Verification Email from CyberCafe (Hackers Lair)', otp);
        console.log('Email sent successfully to - ', EMAIL);

    }
    catch (error) {
        console.log('Error while sending an EMAIL to ', EMAIL);
        throw new error;
    }
}

// pre middleware
OTPSchema.pre('save', async (next) => {
    // console.log("New document saved to database");

    // Only send an EMAIL when a new document is created
    if (this.isNew) {
        await sendVerificationEmail(this.EMAIL, this.otp);
    }
    next();
})



module.exports = mongoose.model('OTP', OTPSchema);