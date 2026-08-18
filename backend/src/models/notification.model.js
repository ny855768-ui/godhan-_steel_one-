const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: [
                "dealer_signup",
                "order_approval",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        dealer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null,
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

module.exports = Notification;