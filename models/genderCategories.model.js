const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genderSchema = new Schema({
    gender_for_item: {
        type: String,
        required: true,
        enum: ['men', 'women', 'unisex'],
        default: 'Unisex'
    }
}, { timestamps: true });

const genderCategory = mongoose.model('genderCategory', genderSchema);
module.exports = genderCategory;
