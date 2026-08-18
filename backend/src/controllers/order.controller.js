const Order = require("../models/order.model");
const User = require("../models/user.model");

// ==========================================
// CREATE ORDER
// ==========================================

const createOrder = async (req, res) => {

    try {

        const {
            product,
            quantity,
            unit,
            deliveryAddress,
            deliveryDate,
            notes,
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !product ||
            !quantity ||
            !deliveryAddress
        ) {

            return res.status(400).json({
                message: "Please fill all required fields",
            });

        }


        // ==========================================
        // CREATE ORDER
        // ==========================================

        const order = await Order.create({

            dealer: req.user.id,

            product,

            quantity: Number(quantity),

            unit: unit || "Ton",

            deliveryAddress,

            deliveryDate: deliveryDate || null,

            notes: notes || "",

            status: "pending",

        });


        return res.status(201).json({

            message: "Order created successfully",

            order,

        });


    } catch (error) {

        console.error(
            "Create order error:",
            error
        );


        return res.status(500).json({

            message: "Server error",

            error: error.message,

        });

    }

};



// ==========================================
// GET MY ORDERS
// ==========================================
// GET /api/orders/my-orders
// ==========================================

const getMyOrders = async (req, res) => {

    try {

        const orders = await Order.find({

            dealer: req.user.id,

        })
        .sort({
            createdAt: -1,
        });


        return res.status(200).json({

            message: "Orders fetched successfully",

            orders,

        });


    } catch (error) {

        console.error(
            "Get my orders error:",
            error
        );


        return res.status(500).json({

            message: "Server error",

        });

    }

};



// ==========================================
// ADMIN - GET ALL ORDERS
// ==========================================
// GET /api/orders/admin/all
// ==========================================

const getAllOrdersForAdmin = async (req, res) => {

    try {

        // ==========================================
        // ADMIN CHECK
        // ==========================================

        if (
            !req.user ||
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                message:
                    "Access denied. Admin only.",

            });

        }


        // ==========================================
        // GET ALL ORDERS
        // ==========================================

        const orders = await Order.find()

            .populate(
                "dealer",
                "name phone email role"
            )

            .sort({
                createdAt: -1,
            });


        return res.status(200).json({

            message:
                "All orders fetched successfully",

            orders,

        });


    } catch (error) {

        console.error(
            "Get all orders for admin error:",
            error
        );


        return res.status(500).json({

            message: "Server error",

            error: error.message,

        });

    }

};



// ==========================================
// ADMIN - UPDATE ORDER STATUS
// ==========================================
// PATCH /api/orders/admin/:orderId/status
// ==========================================

const updateOrderStatus = async (req, res) => {

    try {

        // ==========================================
        // ADMIN CHECK
        // ==========================================

        if (
            !req.user ||
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                message:
                    "Access denied. Admin only.",

            });

        }


        const { orderId } = req.params;

        const { status } = req.body;


        // ==========================================
        // VALID STATUS
        // ==========================================

        const allowedStatuses = [

            "pending",
            "approved",
            "processing",
            "dispatched",
            "delivered",
            "rejected",

        ];


        if (
            !status ||
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Invalid order status",

            });

        }


        // ==========================================
        // FIND ORDER
        // ==========================================

        const order = await Order.findById(
            orderId
        );


        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found",

            });

        }


        // ==========================================
        // UPDATE STATUS
        // ==========================================

        order.status = status;


        await order.save();


        // ==========================================
        // RETURN UPDATED ORDER
        // ==========================================

        const updatedOrder =
            await Order.findById(orderId)

                .populate(
                    "dealer",
                    "name phone email role"
                );


        return res.status(200).json({

            message:
                "Order status updated successfully",

            order: updatedOrder,

        });


    } catch (error) {

        console.error(
            "Update order status error:",
            error
        );


        return res.status(500).json({

            message: "Server error",

            error: error.message,

        });

    }

};



// ==========================================
// ADMIN - GET ORDER STATISTICS
// ==========================================
// GET /api/orders/admin/stats
// ==========================================

const getOrderStats = async (req, res) => {

    try {

        // ==========================================
        // ADMIN CHECK
        // ==========================================

        if (
            !req.user ||
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                message:
                    "Access denied. Admin only.",

            });

        }


        // ==========================================
        // TOTAL ORDERS
        // ==========================================

        const totalOrders =
            await Order.countDocuments();


        // ==========================================
        // PENDING ORDERS
        // ==========================================

        const pendingOrders =
            await Order.countDocuments({

                status: "pending",

            });


        // ==========================================
        // PROCESSING ORDERS
        // ==========================================

        const processingOrders =
            await Order.countDocuments({

                status: {
                    $in: [
                        "approved",
                        "processing",
                    ],
                },

            });


        // ==========================================
        // DELIVERED ORDERS
        // ==========================================

        const deliveredOrders =
            await Order.countDocuments({

                status: "delivered",

            });


        return res.status(200).json({

            message:
                "Order statistics fetched successfully",

            stats: {

                totalOrders,

                pendingOrders,

                processingOrders,

                deliveredOrders,

            },

        });


    } catch (error) {

        console.error(
            "Get order stats error:",
            error
        );


        return res.status(500).json({

            message: "Server error",

            error: error.message,

        });

    }

};



// ==========================================
// EXPORT
// ==========================================

module.exports = {

    createOrder,

    getMyOrders,

    getAllOrdersForAdmin,

    updateOrderStatus,

    getOrderStats,

};