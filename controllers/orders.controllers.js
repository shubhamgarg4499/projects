const asyncHandler = require("../Middlewares/AsyncHandler");
const Order = require("../models/Orders.model");
const ErrorHandler = require("../utils/ErrorHandler");
const { User } = require('../models/User.model')
const createOrders = asyncHandler(async function (req, res, next) {
    const { userId } = req
    const user = await User.findById(userId)
    if (userId.address)
        // const { product, quantity, shipping_address } = req.body
        // const total_amount = 0
        res.send(req.body)
})

module.exports = createOrders

