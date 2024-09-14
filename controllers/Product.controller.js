const asyncHandler = require('../Middlewares/AsyncHandler')
const Product = require('../models/Products.model')
const RatingReview = require('../models/RatingsReviews.model')
const { uploadFileonCloudinary, deleteImagefromCloudinary } = require('../utils/cloudinary')
const ErrorHandler = require('../utils/ErrorHandler')


const addProduct = asyncHandler(async (req, res, next) => {
    try {
        const { genderCategory } = req.body
        const { product_name, description, price, product_stock, category_id, subCategory, childSubCategory, isFeatured = false, discountInPercentage = 0, kidsItems = false } = req.body
        let product;
        const productImages = req?.files.productImages

        const links = []

        if ([product_name, description, price, product_stock, category_id, subCategory, childSubCategory].some(element => element == '')) {
            return next(new ErrorHandler(400, 'All fields are required'))
        }
        if (productImages.length < 2) {
            return next(new ErrorHandler(400, 'Minimum 2 Product images Needed!'))
        }
        for (let imagesObj of productImages) {
            const uploaded = await uploadFileonCloudinary(imagesObj.path)
            links.push(uploaded.secure_url)
        }

        const createProduct = new Product({ ...req.body, images: [...links] })
        await createProduct.save({ validateBeforeSave: false })

        if (genderCategory) {
            product = await Product.aggregate([
                {
                    $match: {
                        _id: createProduct._id
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "topCategory",
                        pipeline: [{
                            $project: {
                                "category_name": 1,
                                "_id": 0
                            }
                        }]
                    }
                },
                {
                    $unwind: "$topCategory"
                },
                {
                    $lookup: {
                        from: "subcategories",
                        localField: "subCategory",
                        foreignField: "_id",
                        as: "subCategory",
                        pipeline: [{
                            $project: {
                                "sub_category_name": 1,
                                "_id": 0
                            }
                        }]
                    }
                },
                {
                    $unwind: "$subCategory"
                },
                {
                    $lookup: {
                        from: "childcategories",
                        localField: "childSubCategory",
                        foreignField: "_id",
                        as: "childSubCategory",
                        pipeline: [{
                            $project: {
                                "childCategory": 1,
                                "_id": 0
                            }
                        }]
                    }
                },
                {
                    $unwind: "$childSubCategory"
                },
                {
                    $lookup: {
                        from: "gendercategories",
                        localField: "genderCategory",
                        foreignField: "_id",
                        as: "genderCategory",
                        pipeline: [{
                            $project: {
                                "gender_for_item": 1,
                                "_id": 0
                            }
                        }]
                    }
                },
                {
                    $unwind: "$genderCategory"
                }
            ])
        } else {
            product = await Product.aggregate([
                {
                    $match: {
                        _id: createProduct._id
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "topCategory",
                        pipeline: [{
                            $project: {
                                "category_name": 1,
                                "_id": 0
                            }
                        }]
                    }
                },
                {
                    $unwind: "$topCategory"
                },
                {
                    $lookup: {
                        from: "subcategories",
                        localField: "subCategory",
                        foreignField: "_id",
                        as: "subCategory",
                        pipeline: [{
                            $project: {
                                "sub_category_name": 1,
                                "_id": 0
                            }
                        }]
                    }
                },
                {
                    $unwind: "$subCategory"
                },
                {
                    $lookup: {
                        from: "childcategories",
                        localField: "childSubCategory",
                        foreignField: "_id",
                        as: "childSubCategory",
                        pipeline: [{
                            $project: {
                                "childCategory": 1,
                                "_id": 0
                            }
                        }]
                    }
                },
                {
                    $unwind: "$childSubCategory"
                }
            ])
        }
        res.send(product)
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})

const getAllProduct = asyncHandler(async function (req, res, next) {
    try {
        const allProduct = await Product.aggregate([
            { $match: {} },
            {
                $lookup: {
                    from: 'ratingreviews',
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'averageRating'
                }
            },
            {
                $addFields: {
                    averageRating: { $avg: '$averageRating.rating' }
                }
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "topCategory",
                    pipeline: [{
                        $project: {
                            "category_name": 1,
                            "_id": 0
                        }
                    }]
                }
            },
            {
                $unwind: "$topCategory"
            },

            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategory",
                    pipeline: [{
                        $project: {
                            "sub_category_name": 1,
                            "_id": 0
                        }
                    }]
                }
            },

            {
                $unwind: "$subCategory"
            },

            {
                $lookup: {
                    from: "childcategories",
                    localField: "childSubCategory",
                    foreignField: "_id",
                    as: "childSubCategory",
                    pipeline: [{
                        $project: {
                            "childCategory": 1,
                            "_id": 0
                        }
                    }]
                }
            },
            {
                $unwind: "$childSubCategory"
            },
            {
                $lookup: {
                    from: "gendercategories",
                    localField: "genderCategory",
                    foreignField: "_id",
                    as: "genderCategory",
                    pipeline: [{
                        $project: {
                            "gender_for_item": 1,
                            "_id": 0
                        }
                    }]
                }
            },
            {
                $unwind: {
                    path: "$genderCategory",
                    preserveNullAndEmptyArrays: true
                }
            }
        ])
        res.json(allProduct)
    } catch (error) {
        throw new ErrorHandler(error.status, error.message)
    }
})

const deleteProductImage = asyncHandler(async function (req, res, next) {
    try {
        const { imageURL } = req?.query
        if (!imageURL) {
            return next(400, 'Error while deleting images')
        }
        await deleteImagefromCloudinary(imageURL)
        res.send('Media deleted successful')
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})

const removeProduct = asyncHandler(async function (req, res, next) {
    try {
        const { _id } = req.query
        if (!_id) {
            return next(new ErrorHandler(404, 'Product Id Not Found'))
        }
        const productSearch = await Product.findById(_id)
        if (!productSearch) {
            return next(new ErrorHandler(404, 'Product Not Found'))
        }
        if (productSearch.images.length >= 1) {
            for (let a of productSearch.images) {
                await deleteImagefromCloudinary(a)
            }
        }
        const deletedProduct = await Product.findByIdAndDelete(_id)

        res.send({ deletedProduct, message: "Product Deleted Successfully" })
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})

const updateProduct = asyncHandler(async function (req, res, next) {
    try {
        const id = req.query.productId
        const data = req.body

        if (!id) {
            return next(404, 'Product Not found')
        }
        const searchProduct = await Product.findById(id)
        if (!searchProduct) {
            return next(new ErrorHandler(400, 'No product found'))
        }
        const findupdate = await Product.findByIdAndUpdate(id, data)

        res.send({ findupdate, message: "Product Updated Successfully" })
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})


const filterProduct = asyncHandler(async function (req, res, next) {
    try {
        // const { price, genderCategory, sub_category_id } = req.query
        const query = { ...req.query }
        const excludeFields = ['sort', 'fields', 'page', 'limit']
        excludeFields.map(e => delete query[e])
        let querystr = JSON.stringify(query).replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`)

        let filtered = Product.find(JSON.parse(querystr))
        // const filtered = await Product.aggregate([{
        //     $match: {}
        // },
        // {
        //     $lookup: {
        //         from: 'gendercategories',
        //         localField: 'genderCategory',
        //         foreignField: '_id',
        //         as: 'gender'
        //     }
        // },
        // {
        //     $lookup: {
        //         from: 'subcategories',
        //         localField: 'sub_category_id',
        //         foreignField: '_id',
        //         as: 'subCategory'
        //     }
        // },
        // {
        //     $unwind: "$gender"
        // },
        // {
        //     $unwind: "$subCategory"
        // },
        // {
        //     $match: {
        //         field: JSON.parse(querystr)
        //     }
        // }])

        // console.log(filtered)

        let page = req.query?.page || 1
        let limit = req.query?.limit || 6
        let skip = (page - 1) * limit
        // console.log(JSON.parse(querystr));
        filtered = await filtered.skip(skip).limit(limit)

        res.send({ totalData: filtered.length, filtered })
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})

module.exports = { addProduct, updateProduct, removeProduct, getAllProduct, filterProduct, deleteProductImage }