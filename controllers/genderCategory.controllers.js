const mongoose = require("mongoose");
const genderCategory = require("../models/genderCategories.model");
const asyncHandler = require('../Middlewares/AsyncHandler');
const ErrorHandler = require("../utils/ErrorHandler");


////////////create gender categories////////////////
const gendercategory = asyncHandler(async (req, res, next) => {
    try {
        const { gender_for_item } = req.body
        if (!gender_for_item) {
            return next(400, "Please enter gender name")
        }
        const alreadyExist = await genderCategory.findOne({ gender_for_item: gender_for_item.toLowerCase() })
        if (alreadyExist) {
            return next(new ErrorHandler(400, 'This Category is Already Exist'))
        }
        const createdGenderCategory = await genderCategory.create({ gender_for_item: gender_for_item.toLowerCase() })
        res.send(createdGenderCategory)
    } catch (error) {
        throw new Error(error.message)
    }
})



// read gender category ///////////////////////////////////////////////

const getAllCategory = asyncHandler(async (req, res, next) => {
    try {
        const readAllCategory = await genderCategory.find()
        res.send(readAllCategory)
    } catch (error) {
        throw new Error(error.message)
    }
})




// update gender category ///////////////////////////////////////////////

const updateCategory = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params
        const { gender_for_item } = req.body
        if (!id) {
            return next(new ErrorHandler(400, "Invalid category id"))
        }
        if (!gender_for_item) {
            return next(new ErrorHandler(400, "Enter new category name"))
        }

        let findCate = await genderCategory.findOne({ gender_for_item: gender_for_item.toLowerCase() })
        if (findCate) {
            return next(new ErrorHandler(400, "You cant create two categories with same name"))
        }

        const updatedCate = await genderCategory.findByIdAndUpdate(id, { gender_for_item }, { new: true })

        res.send(updatedCate)
    } catch (error) {
        throw new Error(error.message)
    }
})



// delete gender category ////////////////////


const deleteCategory = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params
        if (!id) {
            return next(new ErrorHandler(400, "Invalid category id"))
        }
        const deletedCategory = await genderCategory.findByIdAndDelete(id)
        res.send(deletedCategory)
    } catch (error) {
        throw new Error(error.message)
    }
})



module.exports = { gendercategory, updateCategory, deleteCategory, getAllCategory }