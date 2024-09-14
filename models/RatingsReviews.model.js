const mongoose = require("mongoose");
const { Schema } = mongoose
const ratingReviewSchema = new Schema({
    // rating_review_id: { type: String, required: true, unique: true },y
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    review: { type: String, default: '' }
}, { timestamps: true });

const RatingReview = mongoose.model('RatingReview', ratingReviewSchema);
module.exports = RatingReview;
