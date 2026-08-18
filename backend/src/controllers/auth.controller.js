const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// ==========================================
// DEALER SIGNUP
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


        // ==========================================
        // VALIDATION
        // ==========================================

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


        // ==========================================
        // CHECK PHONE
        // ==========================================

        const existingPhone =
            await User.findOne({
                phone,
            });


        if (existingPhone) {

            return res.status(400).json({
                message:
                    "This phone number is already registered",
            });

        }


        // ==========================================
        // CHECK AADHAAR
        // ==========================================

        const existingAadhaar =
            await User.findOne({
                aadhaarNumber,
            });


        if (existingAadhaar) {

            return res.status(400).json({
                message:
                    "This Aadhaar number is already registered",
            });

        }


        // ==========================================
        // CHECK PAN
        // ==========================================

        const existingPan =
            await User.findOne({
                panNumber:
                    panNumber.toUpperCase(),
            });


        if (existingPan) {

            return res.status(400).json({
                message:
                    "This PAN number is already registered",
            });

        }


        // ==========================================
        // CREATE DEALER
        // ==========================================

        const user =
            await User.create({

                name,

                email,

                phone,

                aadhaarNumber,

                panNumber:
                    panNumber.toUpperCase(),

                gstNumber:
                    gstNumber || null,

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

        console.error(
            "Signup error:",
            error
        );


        if (error.code === 11000) {

            return res.status(400).json({

                message:
                    "This email, phone, Aadhaar or PAN is already registered",

            });

        }


        return res.status(500).json({

            message:
                "Server error",

        });

    }

};


// ==========================================
// SEND OTP
// ==========================================
// DEALER LOGIN - OTP
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

        // DEALER
        if (user.role === "dealer") {
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
                    message: "Your account is not approved",
                });
            }
        }

        // ADMIN
        if (user.role === "admin") {
            if (user.status !== "approved") {
                return res.status(403).json({
                    message: "Admin account is not approved",
                });
            }
        }

        // GENERATE OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.otp = otp;

        user.otpExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        await user.save();

        console.log(`OTP for ${phone}: ${otp}`);

        return res.status(200).json({
            message: "OTP sent successfully",

            // DEVELOPMENT ONLY
            otp,
        });

    } catch (error) {
        console.error(
            "Send OTP error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// ==========================================
// VERIFY OTP
// ==========================================
// DEALER LOGIN - OTP
// ==========================================

const verifyOtp = async (req, res) => {

    try {

        const {
            phone,
            otp,
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!phone || !otp) {

            return res.status(400).json({

                message:
                    "Phone number and OTP are required",

            });

        }


        // ==========================================
        // FIND USER
        // ==========================================

        const user =
            await User.findOne({
                phone,
            });


        if (!user) {

            return res.status(404).json({

                message:
                    "Account not found",

            });

        }


        // ==========================================
        // DEALER CHECK
        // ==========================================

        if (user.role === "dealer") {

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
                        "Your dealer account is not approved",

                });

            }

        }


        // ==========================================
        // ADMIN CHECK
        // ==========================================

        if (user.role === "admin") {

            if (user.status !== "approved") {

                return res.status(403).json({

                    message:
                        "Admin account is not approved",

                });

            }

        }


        // ==========================================
        // CHECK OTP EXISTS
        // ==========================================

        if (!user.otp) {

            return res.status(400).json({

                message:
                    "No OTP found. Please request a new OTP.",

            });

        }


        // ==========================================
        // CHECK OTP
        // ==========================================

        if (
            user.otp !== otp.toString()
        ) {

            return res.status(400).json({

                message:
                    "Invalid OTP",

            });

        }


        // ==========================================
        // CHECK OTP EXPIRY
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

        const token =
            jwt.sign(

                {
                    id:
                        user._id.toString(),

                    role:
                        user.role,
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d",
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

            message:
                "Login successful",

            token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role,

                status:
                    user.status,

            },

        });


    } catch (error) {

        console.error(
            "Verify OTP error:",
            error
        );


        return res.status(500).json({

            message:
                "Server error",

        });

    }

};

// ==========================================
// ADMIN LOGIN
// ==========================================
// ADMIN USES PHONE + PASSWORD
// ==========================================

const adminLogin = async (req, res) => {

    try {

        const {
            phone,
            password,
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !phone ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "Phone number and password are required",

            });

        }


        // ==========================================
        // FIND ADMIN
        // ==========================================

        const admin =
            await User.findOne({

                phone,

                role: "admin",

            });


        if (!admin) {

            return res.status(401).json({

                message:
                    "Invalid admin phone number or password",

            });

        }


        // ==========================================
        // CHECK PASSWORD
        // ==========================================

        const isPasswordCorrect =
            await bcrypt.compare(

                password,

                admin.password

            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                message:
                    "Invalid admin phone number or password",

            });

        }


        // ==========================================
        // GENERATE JWT
        // ==========================================

        const token =
            jwt.sign(

                {

                    id:
                        admin._id.toString(),

                    role:
                        admin.role,

                },

                process.env.JWT_SECRET,

                {

                    expiresIn:
                        "7d",

                }

            );


        // ==========================================
        // SUCCESS
        // ==========================================

        return res.status(200).json({

            message:
                "Admin login successful",

            token,

            user: {

                id:
                    admin._id,

                name:
                    admin.name,

                email:
                    admin.email,

                phone:
                    admin.phone,

                role:
                    admin.role,

                status:
                    admin.status,

            },

        });


    } catch (error) {

        console.error(
            "Admin login error:",
            error
        );


        return res.status(500).json({

            message:
                "Server error",

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

    adminLogin,

};