const otpCollection = require("../controllers/otp.model");
const { User } = require("../models/User.model");
const ErrorHandler = require("../utils/ErrorHandler");



async function verifyOTPTime(req, res, next) {
    try {
        const { email } = req.body
        const verified = await User.findOne({ email })
        // res.send(verified.isEmailVerified)
        if (verified?.isEmailVerified) {
            return next(new ErrorHandler(400, "User Email Already Verified"))
        }
        const userOtpObj = await otpCollection.findOne({ userEmail: email })
        if (!userOtpObj) {
            // console.log('hellllllo');
            return next()
        }

        if (userOtpObj?.expiresIn > new Date(Date.now())) {
            const time = ((userOtpObj.expiresIn - new Date(Date.now())) / 1000).toFixed()
            res.send({ message: `Wait ${time} seconds for Resend OTP`, timeToResend: time })
            // return next(new ErrorHandler(400, `Wait ${time} seconds for Resend OTP`))
        } else {
            return next()
        }
    } catch (error) {
        console.log("error occured in middleware");
        throw new ErrorHandler(error.status, error)
    }


}

module.exports = verifyOTPTime