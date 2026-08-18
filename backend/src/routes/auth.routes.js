const express = require("express");

const {
    signup,
    sendOtp,
    verifyOtp,
} = require("../controllers/auth.controller");

const router = express.Router();


// ==========================================
// SIGNUP
// ==========================================

router.post(
    "/signup",
    signup
);


// ==========================================
// SEND OTP
// ==========================================

router.post(
    "/send-otp",
    sendOtp
);


// ==========================================
// VERIFY OTP
// ==========================================

router.post(
    "/verify-otp",
    verifyOtp
);


module.exports = router;