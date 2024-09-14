// const asyncHandler = require("../Middlewares/AsyncHandler");
// const Product = require("../models/Products.model");
// const ErrorHandler = require("../utils/ErrorHandler");

// const filterProduct = asyncHandler(async function (req, res, next) {
//     try {
//         const filter = req.query
//         if (!filter) {
//             return next(new ErrorHandler(402, 'No filter applied'))
//         }
//         const filteredProduct = await Product.find(filter)
//         res.send(filteredProduct)
//     } catch (error) {
//         throw new ErrorHandler(error.status, error)
//     }
// })

// module.exports = { filterProduct }