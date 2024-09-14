const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    category_name: {
        type: String,
        enum: ["fashion", "electronics", "mobiles & accessories", "mobiles", "accessories", "others"],
        required: true,
        unique: true
    }
}, { timestamps: true });

const TopCategory = mongoose.model('Category', CategorySchema);
module.exports = TopCategory;
