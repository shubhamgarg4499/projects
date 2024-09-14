const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    product_name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 1 },
    product_stock: { type: Number, required: true, min: 0 },
    genderCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "genderCategory",
        // required: true
        // enum: ['Men', 'Women', 'Unisex'],
        default: null
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
        required: true
    },
    childSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "childCategory",
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    discountInPercentage: {
        type: Number,
        default: 0
    },
    kidsItems: {
        type: Boolean,
        default: false,
        required: true
    },
    images: [{ type: String, default: '', required: true, maxlength: 5 }],

    size: {
        type: [String],
        enum: ["xsm", "sm", "l", "xl", "xxl", "3xl", "4xl"]
    },
    color: {
        type: [String]
    }

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
