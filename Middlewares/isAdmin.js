const { User } = require("../models/User.model");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("./AsyncHandler");

const checkIsAdmin = asyncHandler(async function (req, res, next) {
    try {
        const { userId } = req
        if (!userId) {
            return next(new ErrorHandler(402, 'Unauthorized Request'))
        }

        const isAdminFind = await User.findById(userId)
        if (!isAdminFind) {
            return next(new ErrorHandler(402, 'Unauthorized Request'))
        }


        if (!isAdminFind.isAdmin) {
            return next(new ErrorHandler(402, 'You Cant Proceed You dont have admin access '))
        }
        next()
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})

module.exports = checkIsAdmin