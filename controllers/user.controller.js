const asyncHandler = require('../Middlewares/AsyncHandler')
const { User, address } = require('../models/User.model')
const ErrorHandler = require('../utils/ErrorHandler')
const { emailOptions, sendingMail } = require('../utils/nodemailer')
const otpGenerator = require('otp-generator')
const otpCollection = require('./otp.model')
require('dotenv').config()
const { findOne, findById, findByIdAndUpdate } = require('./otp.model')
const crypto = require('crypto')
const axios = require('axios')
const { uploadFileonCloudinary, deleteImagefromCloudinary, publicIdtoLink } = require('../utils/cloudinary')

const updateprofilepicture = asyncHandler(async function (req, res, next) {
    try {
        const { userId } = req
        if (!userId) return next(new ErrorHandler(400, 'Unauthorized Request! Login and Try Again'))

        const profilePictureUrl = req?.file.path
        if (!profilePictureUrl) {
            return next(new ErrorHandler(400, 'Cant Find Profile Picture URL Try Again'))
        }

        const profilePicture = await uploadFileonCloudinary(profilePictureUrl)
        if (!profilePicture) {
            return next(new ErrorHandler(400, 'Error Occured while uploading profile photo on server try again'))
        }

        const userr = await User.findById(userId)
        if (userr.profilePicture !== '') {
            const public_id = userr.profilePicture.split('/')
            console.log(public_id[public_id.length - 1].split('.')[0])
            deleteImagefromCloudinary(public_id[public_id.length - 1].split('.')[0])
        }
        if (!userr) {
            return next(new ErrorHandler(404, 'User Not found! Token is invalid'))
        }
        userr.profilePicture = profilePicture.secure_url
        userr.save({ validateBeforeSave: false })
        res.send(userr)
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})
const updateMobileNumber = asyncHandler(async function (req, res, next) {
    try {
        const { userId } = req
        if (!userId) {
            return next(new ErrorHandler(400, 'userId not found'))
        }

        const searchByid = await User.findById(userId)

        if (!searchByid) {
            return next(new ErrorHandler(404, 'User not found'))
        }

        // \\\\\\\\\\\\mobile number otp verification here//////

        searchByid.phone_number = req.body.phone_number
        searchByid.save({ validateBeforeSave: false })
        res.send('Phone Number Updated Successfully')
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})

const updateAddress = asyncHandler(async function (req, res, next) {
    try {
        const { userId } = req
        const { house_street, city, state, postal_code, country } = req.body

        if ([house_street, city, state, postal_code, country].some(element => element.trim() == '')) {
            return next(new ErrorHandler(400, 'Please fill all important (*) fields'))
        }
        // const findDuplicateAddress = address.findOne({ house_street: house_street.toLowerCase() })
        // if (findDuplicateAddress) {
        //     return next(new ErrorHandler(400, 'This address already Added in your Account'))
        // }
        const addressCreaated = await address.create(req.body)
        const user = await User.findById(userId)
        user.address.push(addressCreaated._id)
        const user2 = await User.findById(userId).populate({ path: "address" })
        user.save({ validateBeforeSave: false })
        res.send("Address Updated Sucessfull")
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})

const sendOtp = asyncHandler(async (req, res, next) => {

    try {
        const { email } = req.body
        const otp = Math.floor(1000 + Math.random() * 9000)
        // console.log(email);
        const mess = `<b>Your Otp for Your Account verification is</b> ${otp}`
        const options = await emailOptions(email, mess)
        sendingMail(options)
        const userOTP = await otpCollection.findOneAndDelete({ userEmail: email })
        const otpModel = await otpCollection.create({
            userEmail: email, otp,
            expiresIn: new Date(Date.now() + 3 * 60 * 1000)
        })

        // console.log(userOTP)
        // if (userOTP) {
        //     // await otpCollection.createIndex({ expireAfterSeconds: 300 });
        //     const otpModel = await otpCollection.findOneAndUpdate({ userEmail: email }, { otp })
        // }
        // else {
        //     const otpModel = await otpCollection.create({ userEmail: email, otp })
        // }
        res.send({ message: `OTP sent successfully on ${email}` })
    } catch (error) {
        console.log(error)
        throw new ErrorHandler(400, error)
    }
})

const verifyOtp = asyncHandler(async (req, res, next) => {
    const { userEmail, otp } = req.body
    const userVerified = await User.findOne({ email: userEmail })
    const verified = await otpCollection.findOne({ userEmail })
    if (userVerified.isEmailVerified == true) {
        return next(new ErrorHandler(400, 'User already verified'))

    }
    if (verified.expiresIn < new Date()) {
        return next(new ErrorHandler(400, 'OTP Expired'))
    }
    if (verified.otp !== otp) {
        return next(new ErrorHandler(400, 'Wrong OTP'))
    }
    const user = await User.findOneAndUpdate({ email: userEmail }, { isEmailVerified: true })
    const DeleteAfterVerified = await otpCollection.findOneAndDelete({ userEmail })
    res.send({ verified: true, message: 'Your have been Verified Sucessfully' })
})

////////////////////////////////////////////////
// const reSendOTP = asyncHandler(async (req, res, next) => {
//     console.log('hi');
//     try {
//         const { userEmail } = req.body
//         const otp = Math.floor(1000 + Math.random() * 9000)
//         console.log(otp);
//         const options = await emailOptions(userEmail, otp)
//         sendingMail(options)
//         const otpUpdate = await otpCollection.findOneAndUpdate({ userEmail }, { otp })
//         res.send('Resend OTP Sucessfully')
//     } catch (error) {
//         return next(404, 'OTP didnt sent')
//     }

// });


const generateTokens = async function (Finduser) {
    try {
        const Accesstoken = await Finduser.generateAccessToken()
        const Refreshtoken = await Finduser.generaterRefreshToken()
        Finduser.refreshToken = Refreshtoken
        Finduser.save({ validateBeforeSve: false })
        return { Accesstoken, Refreshtoken }
    } catch (error) {
        throw new ErrorHandler(error.status, error.message)
    }
}
const userLogin = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return next(new ErrorHandler(400, 'Email & Password Both Required'))
        }
        if (!email.includes('@')) {
            return next(new ErrorHandler(400, 'Invalid Email !'))
        }
        const Finduser = await User.findOne({ email })
        if (!Finduser) {
            return next(new ErrorHandler(400, 'User not registered.'))
        }

        const isEqualPass = await Finduser.comparepassword(password)
        if (!isEqualPass) {
            return next(new ErrorHandler(400, 'Invalid Email & Password !'))
        }

        // const user = await User.findOne({ email })
        const { Accesstoken, Refreshtoken } = await generateTokens(Finduser)

        const createduser = await User.findOne({ email }).select("-password -resetPasswordToken -resetTokenExpires")
        res.cookie('Accesstoken', Accesstoken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 55 * 60 * 1000 })
            .cookie('Refreshtoken', Refreshtoken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 70 * 60 * 60 * 1000 })
            .send({
                message: 'You have logged in with this gmail ' + email,
                user: createduser,
                Accesstoken,
                loggedIn: true
            })
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }


})
const userLogout = asyncHandler(async function (req, res, next) {
    try {
        const { userId } = req
        const user = await User.findById(userId)
        if (!user) {
            return next(new ErrorHandler(400, 'Someting Went Wrong While logging out'))
        }

        user.refreshToken = ""
        await user.save({ validateBeforeSave: false })

        res
            .clearCookie('Accesstoken', { httpOnly: true, secure: true })
            .clearCookie('Refreshtoken', { httpOnly: true, secure: true })
            .send('Successfully Logged Out')
    } catch (error) {
        throw new ErrorHandler(error.status, error.message)
    }
})

const updatePassword = asyncHandler(async function (req, res, next) {
    try {
        const { userId } = req
        const { newPassword } = req.body
        if (!newPassword) {
            return next(new ErrorHandler(400, 'Enter new password'))
        }
        const user = await User.findById(userId)
        if (!user) {
            return next(new ErrorHandler(400, 'User not found'))
        }
        user.password = newPassword
        await user.save()
        res.send('Password Changed Succesfully')
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }

})
const resetPassword = asyncHandler(async function (req, res, next) {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!email) {
            return next(new ErrorHandler(400, 'No user found with this email'))
        }
        if (user.resetTokenExpires) {
            if (Date.now() < user.resetTokenExpires) {
                return next(new ErrorHandler(400, 'Wait some minutes for resend otp'))
            }
        }
        const token = await user.passwordResetToken()
        user.save({ validateBeforeSave: false })
        const mess = `Your password reset link is <a href="http://localhost:3000/resetPassword/${token}">click here</a> it will expire in 10 minutes`
        const options = emailOptions(user.email, mess)
        await sendingMail(options)
        res.send('Reset Link Sent Successfully')
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})

const checkPassResetToken = asyncHandler(async function (req, res, next) {
    const { token } = req.query
    const { Newpassword } = req.body
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetTokenExpires: { $gte: Date.now() } })
    if (!user) {
        return next(new ErrorHandler(400, 'Your link has been expired Please try again!'))
    }
    user.password = Newpassword
    user.resetPasswordToken = ''
    user.resetTokenExpires = ''
    user.save()
    res.send('Password changed succesfully')
})


const RegisterUser = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body
        // let profileUrl
        if (!email) {
            return next(new ErrorHandler(400, "Require PhoneNumber/Email"))
        }
        if (email) {
            if (!email.includes("@")) {
                return next(new ErrorHandler(400, "Invalid Email!"))
            }
        }
        if (!password) {
            return next(new ErrorHandler(400, "Enter your password"))
        }
        const alreadyExists = await User.findOne({ email })
        if (alreadyExists) {
            return next(new ErrorHandler(400, "User Already Registered! Please Login"))
        }
        const user = await User.create(req.body)
        console.log("hello");
        const otpSending = await axios.post(`${process.env.base_url}/api/v1/user/sendotp`, { email })
        // console.log()
        // if (!otpSending) {
        //     return next(new ErrorHandler(400, "Something Went wrong in Send OTP on mail Please try again"))
        // }
        // console.log("hello2");
        res.send({ email: user?.email, user: user?.name, message: otpSending.data, success: true })
    } catch (error) {
        console.log("error occured in register controller")
        throw new ErrorHandler(error.status, error)
    }

})
module.exports = { RegisterUser, verifyOtp, userLogin, sendOtp, userLogout, updateMobileNumber, updateAddress, updatePassword, resetPassword, checkPassResetToken, updateprofilepicture }