const mongoose = require("mongoose");

// =========================================================
// ORDER SCHEMA
// =========================================================

const orderSchema = new mongoose.Schema(
    {

        // =====================================================
        // DEALER
        // =====================================================

        dealer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


        // =====================================================
        // PRODUCT
        // =====================================================

        product: {
            type: String,
            required: true,
        },


        // =====================================================
        // QUANTITY
        // =====================================================

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },


        // =====================================================
        // UNIT
        // =====================================================

        unit: {
            type: String,

            enum: [
                "Ton",
                "Kg",
            ],

            default: "Ton",
        },


        // =====================================================
        // TOTAL ORDER AMOUNT
        // =====================================================
        // This will be used by Admin Dashboard
        // to calculate Total Revenue.
        //
        // Existing orders without this field will automatically
        // behave as 0 because of default: 0.
        // =====================================================

        totalAmount: {
            type: Number,
            min: 0,
            default: 0,
        },


        // =====================================================
        // DELIVERY ADDRESS
        // =====================================================

        deliveryAddress: {
            type: String,
            required: true,
        },


        // =====================================================
        // DELIVERY DATE
        // =====================================================

        deliveryDate: {
            type: Date,
            default: null,
        },


        // =====================================================
        // NOTES
        // =====================================================

        notes: {
            type: String,
            default: "",
        },


        // =====================================================
        // ORDER STATUS
        // =====================================================

        status: {

            type: String,

            enum: [
                "pending",
                "approved",
                "processing",
                "dispatched",
                "delivered",
                "rejected",
            ],

            default: "pending",
        },

    },


    // =========================================================
    // AUTOMATIC CREATED / UPDATED DATES
    // =========================================================

    {
        timestamps: true,
    }
);


// =========================================================
// EXPORT MODEL
// =========================================================

module.exports = mongoose.model(
    "Order",
    orderSchema
);