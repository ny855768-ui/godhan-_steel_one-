const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },


password: {
    type: String,
    default: null,
},

        aadhaarNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        panNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        gstNumber: {
            type: String,
            default: null,
            trim: true,
        },

        role: {
            type: String,
            enum: ["dealer", "admin"],
            default: "dealer",
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        // =========================
        // OTP
        // =========================

        otp: {
            type: String,
            default: null,
        },

        otpExpiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;