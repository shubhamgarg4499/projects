const asyncHandler = require("../Middlewares/AsyncHandler");
const jwt = require('jsonwebtoken');
const { User } = require("../models/User.model");
const ErrorHandler = require("../utils/ErrorHandler");
require('dotenv').config();

const persistLogin = asyncHandler(async (req, res, next) => {
    const { Accesstoken, Refreshtoken } = req.cookies;

    // Step 1: Check if both tokens are missing
    if (!Accesstoken && !Refreshtoken) {
        return next(new ErrorHandler(403, "No tokens found, please log in."));
    }

    try {
        let user;
        // Step 2: Try to verify the access token
        if (Accesstoken) {
            try {
                const decoded = jwt.verify(Accesstoken, process.env.ACCESS_TOKEN_SECRET);
                user = await User.findById(decoded._id).select("-password -resetPasswordToken -resetTokenExpires");
                if (!user) return next(new ErrorHandler(404, "User not found."));
                // If access token is valid, return user data
                return res.send({ user, accessToken: Accesstoken });
            } catch (error) {
                if (error.name !== 'TokenExpiredError') {
                    throw error; // If the error isn't related to token expiration, rethrow it
                }
            }
        }

        // Step 3: If access token is expired or missing, verify the refresh token
        if (Refreshtoken) {
            const decodedRefresh = jwt.verify(Refreshtoken, process.env.REFRESH_TOKEN_SECRET);
            user = await User.findById(decodedRefresh._id).select("-password -resetPasswordToken -resetTokenExpires");
            if (!user) return next(new ErrorHandler(404, "User not found."));

            // Generate a new access token
            const newAccessToken = jwt.sign({ _id: decodedRefresh._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            res.cookie('Accesstoken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 55 * 60 * 1000 });

            return res.send({ user, accessToken: newAccessToken });
        }

        // If we reach this point, neither token is valid
        res.clearCookie('Accesstoken', { httpOnly: true, secure: true });
        res.clearCookie('Refreshtoken', { httpOnly: true, secure: true });
        return res.status(401).send({ message: 'Session expired. Please log in again.', success: false });

    } catch (error) {
        next(new ErrorHandler(500, error.message || "Internal Server Error"));
    }
});

module.exports = persistLogin;
