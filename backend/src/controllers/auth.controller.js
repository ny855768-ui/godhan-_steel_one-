const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// ==========================================
// SIGNUP
// ==========================================

const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            aadhaarNumber,
            panNumber,
            gstNumber,
        } = req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !aadhaarNumber ||
            !panNumber
        ) {
            return res.status(400).json({
                message: "Please fill all required fields",
            });
        }

        const existingPhone = await User.findOne({
            phone,
        });

        if (existingPhone) {
            return res.status(400).json({
                message: "This phone number is already registered",
            });
        }

        const existingAadhaar = await User.findOne({
            aadhaarNumber,
        });

        if (existingAadhaar) {
            return res.status(400).json({
                message: "This Aadhaar number is already registered",
            });
        }

        const existingPan = await User.findOne({
            panNumber: panNumber.toUpperCase(),
        });

        if (existingPan) {
            return res.status(400).json({
                message: "This PAN number is already registered",
            });
        }

        const user = await User.create({
            name,
            email,
            phone,
            aadhaarNumber,
            panNumber: panNumber.toUpperCase(),
            gstNumber: gstNumber || null,
            role: "dealer",
            status: "pending",
        });

        return res.status(201).json({
            message:
                "Registration successful. Your account is waiting for Godhan Steel admin approval.",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
            },
        });

    } catch (error) {
        console.error("Signup error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message:
                    "This email, phone, Aadhaar or PAN is already registered",
            });
        }

        return res.status(500).json({
            message: "Server error",
        });
    }
};


// ==========================================
// SEND OTP
// ==========================================

const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                message: "Phone number is required",
            });
        }

        const user = await User.findOne({
            phone,
        });

        if (!user) {
            return res.status(404).json({
                message: "Account not found",
            });
        }

        // ==========================================
        // ADMIN
        // ==========================================

        if (user.role === "admin") {
            // Admin is allowed to request OTP.
        }

        // ==========================================
        // DEALER
        // ==========================================

        else if (user.role === "dealer") {

            if (user.status === "pending") {
                return res.status(403).json({
                    message:
                        "Your account is waiting for Godhan Steel admin approval",
                });
            }

            if (user.status === "rejected") {
                return res.status(403).json({
                    message:
                        "Your dealer account has been rejected by Godhan Steel",
                });
            }

            if (user.status !== "approved") {
                return res.status(403).json({
                    message:
                        "Your account is not approved",
                });
            }
        }

        // ==========================================
        // UNKNOWN ROLE
        // ==========================================

        else {
            return res.status(403).json({
                message: "Invalid account role",
            });
        }

        // ==========================================
        // GENERATE OTP
        // ==========================================

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;

        await user.save();

        // ==========================================
        // DEVELOPMENT OTP
        // ==========================================

        console.log("");
        console.log("======================================");
        console.log(`OTP for ${phone}: ${otp}`);
        console.log("OTP expires in: 5 minutes");
        console.log("======================================");
        console.log("");

        return res.status(200).json({
            message: "OTP sent successfully",

            // DEVELOPMENT ONLY
            otp,
        });

    } catch (error) {
        console.error("Send OTP error:", error);

        return res.status(500).json({
            message: "Server error",
        });
    }
};


// ==========================================
// VERIFY OTP
// ==========================================

const verifyOtp = async (req, res) => {
    try {
        const {
            phone,
            otp,
        } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                message:
                    "Phone number and OTP are required",
            });
        }

        const user = await User.findOne({
            phone,
        });

        if (!user) {
            return res.status(404).json({
                message: "Account not found",
            });
        }

        // ==========================================
        // CHECK ROLE
        // ==========================================

        if (
            user.role !== "admin" &&
            user.role !== "dealer"
        ) {
            return res.status(403).json({
                message: "Invalid account role",
            });
        }

        // ==========================================
        // DEALER APPROVAL CHECK
        // ==========================================

        if (user.role === "dealer") {

            if (user.status !== "approved") {
                return res.status(403).json({
                    message:
                        "Your account is not approved by Godhan Steel",
                });
            }
        }

        // ==========================================
        // CHECK OTP
        // ==========================================

        if (!user.otp) {
            return res.status(400).json({
                message:
                    "No OTP found. Please request a new OTP.",
            });
        }

        if (user.otp !== otp.toString()) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        // ==========================================
        // CHECK EXPIRY
        // ==========================================

        if (
            !user.otpExpiresAt ||
            user.otpExpiresAt < new Date()
        ) {
            user.otp = null;
            user.otpExpiresAt = null;

            await user.save();

            return res.status(400).json({
                message:
                    "OTP has expired. Please request a new OTP.",
            });
        }

        // ==========================================
        // GENERATE JWT
        // ==========================================

        const token = jwt.sign(
            {
                id: user._id.toString(),
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // ==========================================
        // CLEAR OTP
        // ==========================================

        user.otp = null;
        user.otpExpiresAt = null;

        await user.save();

        // ==========================================
        // SUCCESS
        // ==========================================

        return res.status(200).json({
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
            },
        });

    } catch (error) {
        console.error("Verify OTP error:", error);

        return res.status(500).json({
            message: "Server error",
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    signup,
    sendOtp,
    verifyOtp,
};