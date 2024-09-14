const jwt = require('jsonwebtoken')
const { User } = require('../models/User.model')
const ErrorHandler = require('../utils/ErrorHandler')
require('dotenv').config()
async function checkAccessToken(req, _, next) {
    try {
        // const { Accesstoken, Refreshtoken } = req.cookies
        // let Accesstoken;
        // let { cookies, headers } = req
        let { Accesstoken, Refreshtoken } = req?.cookies
        // if (cookies && cookies.Accesstoken) {
        //     Accesstoken = cookies.Accesstoken
        // } else if (headers && headers.authorization) {
        //     Accesstoken = headers.authorization.split(' ')[1]
        // }
        // console.log(headers)

        if (!Accesstoken && !Refreshtoken) {
            return next(new ErrorHandler(404, "Token Not found! please Login"))
        }
        if (!Accesstoken) {
            return next(new ErrorHandler(401, "Unauthorised Request"))
        }
        try {
            const verifyToken = await jwt.verify(Accesstoken, process.env.ACCESS_TOKEN_SECRET)
            req.userId = verifyToken._id
            return next()
        } catch (error) {
            if (error.name !== "TokenExpiredError") return next(new ErrorHandler(error.status, error))
            return next(new ErrorHandler(401, "AccessToken Expired"))
        }
    } catch (error) {
        return next(new ErrorHandler(error.status, error))
    }
}

module.exports = checkAccessToken