const asyncHandler = require("../Middlewares/AsyncHandler");
const { User } = require("../models/User.model");
const ErrorHandler = require("../utils/ErrorHandler");

const makeUserAdmin = asyncHandler(async function (req, res, next) {
    try {
        const { email } = req.body
        if (!email) {
            return next(new ErrorHandler(400, 'Enter Email To Make Someone Admin'))
        }

        const searchUser = await User.findOne({ email })
        if (!email) {
            return next(new ErrorHandler(400, 'No user Found with this gmail'))
        }

        if (searchUser.isAdmin) {
            return next(new ErrorHandler(400, 'This User is Already Admin'))
        }

        searchUser.isAdmin = true
        searchUser.save({ validateBeforeSave: false })
        res.send('This ' + email + ' user have admin role He can access anything in your store!')
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})


const removeUserAdmin = asyncHandler(async function (req, res, next) {
    const { email } = req.body
    if (!email) {
        return next(new ErrorHandler(400, 'Please Enter email for search user to remove from admin role'))
    }

    const searchUser = await User.findOne({ email })

    if (!searchUser) {
        return next(new ErrorHandler(400, 'User not registered please check Email'))
    }

    if (!searchUser.isAdmin) {
        return next(new ErrorHandler(400, `This user ${email} is not an admin`))
    }
    searchUser.isAdmin = false
    searchUser.save({ validateBeforeSave: false })

    res.send(email + " This user successfully removed from admin role")
})

module.exports = { makeUserAdmin, removeUserAdmin }