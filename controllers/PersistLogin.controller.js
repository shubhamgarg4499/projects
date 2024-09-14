const asyncHandler = require("../Middlewares/AsyncHandler");
const jwt = require('jsonwebtoken')
const { User } = require("../models/User.model");
const ErrorHandler = require("../utils/ErrorHandler");
require('dotenv').config()
const persistLogin = asyncHandler(async (req, res, next) => {
    const { Accesstoken, Refreshtoken } = req?.cookies
    if (!Accesstoken && !Refreshtoken) return next(new ErrorHandler(401, "Unauthorised request"))
    try {
        if (Accesstoken) {
            try {
                const verifying = await jwt.verify(Accesstoken, process.env.ACCESS_TOKEN_SECRET)
                // return res.send(verifying)
                const findUser = await User.findById(verifying._id).select("-password -resetPasswordToken -resetTokenExpires")
                if (!findUser) return next(new ErrorHandler(404, "User Not Found"))
                return res.send({ user: findUser, Accesstoken, success: true })
            } catch (error) {
                // console.log(error.name);
                if (error.name !== "TokenExpiredError") throw new ErrorHandler(error.status, error)
            }
        }

        if (Refreshtoken) {
            try {
                const verifyingRefresh = await jwt.verify(Refreshtoken, process.env.REFRESH_TOKEN_SECRET)

                const findingUser = await User.findById(verifyingRefresh?._id).select("-password -resetPasswordToken -resetTokenExpires")
                if (!findingUser) return next(new ErrorHandler(404, "Wrong Token! User Not Found"))

                const newAcessToken = jwt.sign({ _id: verifyingRefresh?._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })

                res.cookie('Accesstoken', newAcessToken, { httpOnly: true, secure: true, sameSite: true, maxAge: 55 * 60 * 1000 })
                return res.send({
                    user: findingUser,
                    Accesstoken: newAcessToken,
                    success: true
                })

            } catch (error) {
                res.clearCookie('Accesstoken', { httpOnly: true, secure: true })
                res.clearCookie('Refreshtoken', { httpOnly: true, secure: true })
                return res.send({ message: 'Session Expired ! Please login', success: false })
            }
        }
        // console.log("hii");
        res.clearCookie('Accesstoken', { httpOnly: true, secure: true })
        res.clearCookie('Refreshtoken', { httpOnly: true, secure: true })
        return res.send({ message: 'Session Expired ! Please login', success: false })

    } catch (error) {
        throw new ErrorHandler(error.status, error.message)
    }
})

module.exports = persistLogin