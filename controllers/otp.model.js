const mongoose = require("mongoose");
const otpSchema = mongoose.Schema({
    userEmail: {
        type: String,
        unique: true
    },
    otp: {
        type: Number,
        required: true
    },
    expiresIn: {
        type: Date
    }
}, { timestamps: true })

// otpSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 10 });

const otpCollection = mongoose.model('otpCollection', otpSchema)

module.exports = otpCollection