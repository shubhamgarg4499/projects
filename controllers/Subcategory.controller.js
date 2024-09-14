const mongoose = require("mongoose");
const asyncHandler = require('../Middlewares/AsyncHandler');
const { SubCategory } = require("../models/subCategory");
const ErrorHandler = require("../utils/ErrorHandler");


////////////create sub category///////////
const createSubCategory = asyncHandler(async (req, res, next) => {
    try {
        const { sub_category_name } = req.body
        if (!sub_category_name) {
            return next(400, "Please enter SubCategory")
        }
        const alreadyExists = await SubCategory.findOne({ sub_category_name: sub_category_name.toLowerCase() })

        if (alreadyExists) {
            return next(new ErrorHandler(400, 'This Category Already Exists'))
        }
        const createdSubCategory = await SubCategory.create({ sub_category_name: sub_category_name.toLowerCase() })
        res.send({ data: createdSubCategory, message: 'Category Created' })
    } catch (error) {
        throw new ErrorHandler(error.status, error.message)
    }
})



// read all sub category ///////////////////////////////////////////////

const getAllSubCategory = asyncHandler(async (req, res, next) => {
    try {
        const readAllSubCategory = await SubCategory.find().select("sub_category_name -_id")
        res.send(readAllSubCategory)
    } catch (error) {
        throw new Error(error.message)
    }
})




// update sub category ///////////////////////////////////////////////

const updateSubCategory = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params
        const { sub_category_name } = req.body
        if (!id) {
            return next(new ErrorHandler(400, "Invalid category"))
        }
        if (!sub_category_name) {
            return next(new ErrorHandler(400, "Enter new category name"))
        }
        const findCat = await SubCategory.findOne({ sub_category_name })
        if (findCat) {
            return next(new ErrorHandler(400, `You cant update category with this '${sub_category_name}' Because already a category created with this name ! `))
        }
        const updatedSubCate = await SubCategory.findByIdAndUpdate(id, { sub_category_name: sub_category_name.toLowerCase() }, { new: true })
        res.send({ data: updatedSubCate, message: "Successfully updated" })
    } catch (error) {
        throw new Error(error.message)
    }
})



// delete sub category ////////////////////


const deleteSubCategory = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params
        if (!id) {
            return next(400, "Invalid category id")
        }

        const deletedSubCategory = await SubCategory.findByIdAndDelete(id)
        res.send(`${deletedSubCategory.sub_category_name} category deleted sucessfully`)
    } catch (error) {
        throw new Error(error.message)
    }
})



module.exports = { createSubCategory, updateSubCategory, deleteSubCategory, getAllSubCategory }