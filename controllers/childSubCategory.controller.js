const asyncHandler = require("../Middlewares/AsyncHandler");
const { childSubCategory } = require("../models/subCategory");
const ErrorHandler = require("../utils/ErrorHandler");


///////create childSubCategory //////////////

const createchildSubCategory = asyncHandler(async (req, res, next) => {
    try {
        const { childCategory } = req.body
        if (!childCategory) return next(new ErrorHandler(400, 'Please enter category'))
        const finding = await childSubCategory.findOne({ childCategory: childCategory.toLowerCase() })
        if (finding) return next(new ErrorHandler(400, 'This Category already exists you cant create again'))
        const create = await childSubCategory.create({ childCategory: childCategory.toLowerCase() })
        res.status(200).send({ message: "Category created successfull", data: create })

    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }
})


///////read all childSubCategory //////////////

const getAllchildSubCategory = asyncHandler(async (req, res, next) => {
    try {
        const getall = await childSubCategory.find().select("childCategory -_id")
        res.send(getall)
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }

})

///////update all childSubCategory //////////////

const updatechildSubCategory = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params
        const { childCategory } = req.body
        if (!childCategory) return next(new ErrorHandler(400, "Enter New Category"))

        if (!id) return next(new ErrorHandler(400, "Category ID not found"))

        const checkingId = await childSubCategory.findById(id)
        if (!checkingId) return next(new ErrorHandler(400, "Wrong car=tegory ID!"))

        const finding = await childSubCategory.findOne({ childCategory: childCategory.toLowerCase() })
        if (finding) return next(new ErrorHandler(400, `${childCategory} category already exists you cant duplictate`))

        const update = await childSubCategory.findByIdAndUpdate(id, { $set: { childCategory: childCategory.toLowerCase() } }, { new: true })
        res.send({ message: "Updated sucessfully", data: update })
    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }

})

///////delete all childSubCategory //////////////

const deletechildSubCategory = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params
        if (!id) return next(new ErrorHandler(400, "Category not found"))

        const deleteCate = await childSubCategory.findByIdAndDelete(id)
        res.send({ message: `'${deleteCate.childCategory}' category deleted successfully` })

    } catch (error) {
        throw new ErrorHandler(error.status, error)
    }


})


module.exports = { createchildSubCategory, getAllchildSubCategory, updatechildSubCategory, deletechildSubCategory }