const mongoose = require("mongoose");

const subCat = new mongoose.Schema({
    sub_category_name: {
        // clothing,Accessories,home appliances,wearables,jewellery,laptop & Accessories
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })


const SubCategory = mongoose.model('subCategory', subCat)


const childCat = new mongoose.Schema({
    childCategory: {
        // tshirts,dryers,curtains,watches,necklace
        type: String,
        required: true,
        unique: true,
        default: "Uncategorized"
    }
}, { timestamps: true })


const childSubCategory = mongoose.model('childCategory', childCat)
module.exports = { SubCategory, childSubCategory }