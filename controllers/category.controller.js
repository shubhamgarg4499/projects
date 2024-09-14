const asyncHandler = require("../Middlewares/AsyncHandler");
const TopCategory = require("../models/categories.model");
const ErrorHandler = require("../utils/ErrorHandler");

///////////////create top level category//////

const createTopLevelCategory = asyncHandler(async (req, res, next) => {
    try {
        const { category_name } = req.body
        if (!category_name) {
            return next(new ErrorHandler(400, 'Enter Category Name to add new Category'))
        }
        const findExistingCat = await TopCategory.findOne({ category_name: category_name.toLowerCase() })

        if (findExistingCat) {
            return next(new ErrorHandler(400, 'This category already exists, You cant create it twice'))
        }
        const created = await TopCategory.create({ category_name: category_name.toLowerCase() })
        res.send(created)
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})


///////////// read all categories ////////////////


const readAllTopLevelCategories = asyncHandler(async (req, res, next) => {
    try {

        // by aggregation////
        // const allCategories = await TopCategory.aggregate([
        //     {
        //         $group: {
        //             _id: "$category_name"
        //         }
        //     }
        // ])

        const allCategories = await TopCategory.find({}).select("category_name -_id")
        res.send(allCategories)
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})


/////////update Top Level category///////

const updateTopLevelcategory = asyncHandler(async (req, res, next) => {
    try {
        const { categoryId } = req.params
        const { category_name } = req.body
        if (!category_name) {
            return next(new ErrorHandler(400, "Enter your new updated Category"))
        }
        const find = await TopCategory.findOne({ categoryId: category_name.toLowerCase() })
        if (find) {
            return next(new ErrorHandler(400, `You cant update category with this "${category_name}" Because already a category created with this name ! `))
        }
        if (!categoryId) {
            return next(new ErrorHandler(400, "Category Id not Found"))
        }
        const findCate = await TopCategory.findById(categoryId)
        if (!findCate) {
            return next(new ErrorHandler(400, "Category ID is Wrong ! Category not Found"))
        }
        const updateCate = await TopCategory.findByIdAndUpdate(categoryId, { category_name: category_name.toLowerCase() })
        res.send(updateCate)
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})



/////////delete Top Level category///////

const deleteTopLevelcategory = asyncHandler(async (req, res, next) => {
    try {
        const { categoryId } = req.params
        if (!categoryId) return next(new ErrorHandler(400, 'No Category id found'))
        const findCate = await TopCategory.findById(categoryId)
        if (!findCate) return next(new ErrorHandler(400, 'Category not found Wrong category ID !'))
        const deleteCate = await TopCategory.findByIdAndDelete(categoryId)
        res.send({ message: `${deleteCate.category_name} Category deleted successfully` })
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }

    // res.send('hii')
})
module.exports = { createTopLevelCategory, readAllTopLevelCategories, updateTopLevelcategory, deleteTopLevelcategory }