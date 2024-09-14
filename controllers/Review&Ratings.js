const asyncHandler = require('../Middlewares/AsyncHandler')
const RatingReview = require('../models/RatingsReviews.model')
const mongoose = require("mongoose");
const ErrorHandler = require('../utils/ErrorHandler');
const Product = require('../models/Products.model');


// post review rating////////////
const ReviewRating = asyncHandler(async (req, res, next) => {
    try {
        const { userId } = req
        const { product_id, rating, review } = req.body
        if (!userId) {
            return next(new ErrorHandler(400, 'Unauthorised Request'))
        }
        if ([userId, product_id].some(e => e.trim() == '') || rating == '') {
            return next(new ErrorHandler(400, 'All field necessary'))
        }
        const productSearch = await Product.findById(product_id)
        if (!productSearch) {
            return next(new ErrorHandler(400, 'Wrong product id'))
        }

        // const reviewCheck = await RatingReview.aggregate([
        //     {
        //         $match: {
        //             product_id: new mongoose.Types.ObjectId(product_id),
        //             user_id: new mongoose.Types.ObjectId(userId)
        //         }
        //     }
        // ])
        // console.log(reviewCheck)
        // if (reviewCheck.length > 0) {
        //     return next(new ErrorHandler(400, 'This user already has been given review on this product'))
        // }
        const createdReview = await RatingReview.create({ user_id: userId, ...req.body })
        const findCreated = await RatingReview.findById(createdReview._id)
            .populate('user_id').populate("product_id")

        // res.send(findCreated)
        res.status(200).send({ message: "Your Review/Rating posted sucessfully", createdReview })
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }

})


// get avg of rating
const getRating = asyncHandler(async (req, res, next) => {
    try {
        const { product_id } = req?.query
        if (!product_id) {
            return next(new ErrorHandler(400, 'Product Not found Wrong product id !'))
        }

        const findReviewRating = await RatingReview.aggregate([
            {
                $match: {
                    product_id: new mongoose.Types.ObjectId(product_id)
                }
            },
            {
                $group: {
                    _id: '$product_id',
                    averageRating: { $avg: '$rating' }
                }
            }
        ])

        // const allReviews = await RatingReview.aggregate([{}])
        res.send(findReviewRating)
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})


const getAllReviews = asyncHandler(async function (req, res, next) {
    const { product_id } = req?.query
    const reviews = await RatingReview.aggregate([{
        $match: {
            product_id: new mongoose.Types.ObjectId(product_id)
        }
    },
    {
        $project: {
            user_id: 1,
            review: 1,
            rating: 1,
            createdAt: 1
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "users",
            pipeline: [{
                $project: {
                    name: 1,
                    profilePicture: 1
                }
            }]
        }
    },
    { $unwind: "$users" }
    ])
    res.send(reviews)
})



module.exports = { ReviewRating, getRating, getAllReviews }