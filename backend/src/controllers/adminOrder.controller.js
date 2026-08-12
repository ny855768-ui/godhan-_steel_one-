const Order = require("../models/order.model");

// =========================================================
// GET ALL ORDERS FOR ADMIN
// =========================================================

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate(
                "dealer",
                "name email phone role status"
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            message: "Orders fetched successfully",

            orders,

            totalOrders: orders.length,
        });
    } catch (error) {
        console.error(
            "Get all admin orders error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// =========================================================
// GET SINGLE ORDER
// =========================================================

const getAdminOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate(
                "dealer",
                "name email phone role status"
            );

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.status(200).json({
            message: "Order fetched successfully",

            order,
        });
    } catch (error) {
        console.error(
            "Get admin order error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// =========================================================
// UPDATE ORDER STATUS
// =========================================================

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const { status } = req.body;

        // =====================================================
        // VALID STATUSES
        // =====================================================

        const validStatuses = [
            "pending",
            "approved",
            "processing",
            "dispatched",
            "delivered",
            "rejected",
        ];

        if (!status) {
            return res.status(400).json({
                message: "Order status is required",
            });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status",

                validStatuses,
            });
        }

        // =====================================================
        // FIND ORDER
        // =====================================================

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // =====================================================
        // UPDATE STATUS
        // =====================================================

        order.status = status;

        await order.save();

        // =====================================================
        // RETURN UPDATED ORDER
        // =====================================================

        const updatedOrder =
            await Order.findById(id)
                .populate(
                    "dealer",
                    "name email phone role status"
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
        });
    }
};

// =========================================================
// GET ORDER STATISTICS
// =========================================================

const getOrderStats = async (req, res) => {
    try {
        const totalOrders =
            await Order.countDocuments();

        const pendingOrders =
            await Order.countDocuments({
                status: "pending",
            });

        const approvedOrders =
            await Order.countDocuments({
                status: "approved",
            });

        const processingOrders =
            await Order.countDocuments({
                status: "processing",
            });

        const dispatchedOrders =
            await Order.countDocuments({
                status: "dispatched",
            });

        const deliveredOrders =
            await Order.countDocuments({
                status: "delivered",
            });

        const rejectedOrders =
            await Order.countDocuments({
                status: "rejected",
            });

        return res.status(200).json({
            message:
                "Order statistics fetched successfully",

            stats: {
                totalOrders,

                pendingOrders,

                approvedOrders,

                processingOrders,

                dispatchedOrders,

                deliveredOrders,

                rejectedOrders,
            },
        });
    } catch (error) {
        console.error(
            "Get order stats error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// =========================================================
// EXPORT
// =========================================================

module.exports = {
    getAllOrders,
    getAdminOrderById,
    updateOrderStatus,
    getOrderStats,
};