const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const addressSchema = new Schema({
    house_street: { type: String, required: true, default: '', lowercase: true },
    city: { type: String, required: true, default: '', lowercase: true },
    state: { type: String, required: true, default: '', lowercase: true },
    postal_code: { type: String, required: true, default: '', lowercase: true },
    country: { type: String, required: true, default: 'india', lowercase: true }
});
const address = mongoose.model('address', addressSchema)
const crypto = require('crypto')
const userSchema = new Schema({
    email: { type: String, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true, default: "User" },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: 'address' }],
    phone_number: {
        type: Number,
        unique: true,
        sparse: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneNumberVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: ''
    },
    resetPasswordToken: {
        type: String,
        default: ''
    },
    resetTokenExpires: {
        type: Date,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ""
    }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
    }
    next()
})
userSchema.methods.comparepassword = async function (stringpwd) {
    try {
        const compared = await bcrypt.compare(stringpwd, this.password)
        return compared
    } catch (error) {
        throw new ErrorHandler(400, error.message)
    }
}
userSchema.methods.generateAccessToken = async function () {
    try {
        const accessToken = await jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        return accessToken
    } catch (error) {
        throw new ErrorHandler(error.status, error.message)
    }
}
userSchema.methods.generaterRefreshToken = async function () {
    try {
        const RefreshToken = await jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' })
        return RefreshToken
    } catch (error) {
        throw new ErrorHandler(error.status, error.message)
    }
}

userSchema.methods.passwordResetToken = async function () {
    const token = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    this.resetTokenExpires = Date.now() + 3 * 60 * 1000
    return token
}

const User = mongoose.model('User', userSchema);
module.exports = { User, address };
