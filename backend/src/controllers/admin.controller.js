const User = require("../models/user.model");
const Order = require("../models/order.model");

// =========================================================
// GET ADMIN DASHBOARD STATS
// =========================================================

const getDashboardStats = async (req, res) => {
    try {
        const totalDealers = await User.countDocuments({
            role: "dealer",
            status: "approved",
        });

        const pendingDealers = await User.countDocuments({
            role: "dealer",
            status: "pending",
        });

        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            status: "pending",
        });

        const revenueResult = await Order.aggregate([
            {
                $match: {
                    status: {
                        $in: [
                            "approved",
                            "processing",
                            "dispatched",
                            "delivered",
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $ifNull: ["$totalAmount", 0],
                        },
                    },
                },
            },
        ]);

        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;

        return res.status(200).json({
            message: "Dashboard stats fetched successfully",

            stats: {
                totalDealers,
                pendingDealers,
                totalOrders,
                pendingOrders,
                totalRevenue,
            },
        });
    } catch (error) {
        console.error(
            "Get dashboard stats error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// =========================================================
// GET TOTAL APPROVED DEALERS
// =========================================================

const getTotalDealers = async (req, res) => {
    try {
        const dealers = await User.find({
            role: "dealer",
            status: "approved",
        }).select(
            "name email phone role status createdAt"
        );

        return res.status(200).json({
            message: "Approved dealers fetched successfully",

            dealers,

            totalDealers: dealers.length,
        });
    } catch (error) {
        console.error(
            "Get total dealers error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// =========================================================
// GET PENDING DEALERS
// =========================================================

const getPendingDealers = async (req, res) => {
    try {
        const dealers = await User.find({
            role: "dealer",
            status: "pending",
        })
            .select(
                "name email phone role status createdAt"
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            message: "Pending dealers fetched successfully",

            dealers,

            totalPendingDealers: dealers.length,
        });
    } catch (error) {
        console.error(
            "Get pending dealers error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// =========================================================
// APPROVE DEALER
// =========================================================

const approveDealer = async (req, res) => {
    try {
        const { id } = req.params;

        const dealer = await User.findOne({
            _id: id,
            role: "dealer",
        });

        if (!dealer) {
            return res.status(404).json({
                message: "Dealer not found",
            });
        }

        if (dealer.status === "approved") {
            return res.status(400).json({
                message: "Dealer is already approved",
            });
        }

        dealer.status = "approved";

        await dealer.save();

        return res.status(200).json({
            message:
                "Dealer approved successfully. Dealer can now login.",

            dealer: {
                _id: dealer._id,
                name: dealer.name,
                email: dealer.email,
                phone: dealer.phone,
                role: dealer.role,
                status: dealer.status,
            },
        });
    } catch (error) {
        console.error(
            "Approve dealer error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// =========================================================
// REJECT DEALER
// =========================================================

const rejectDealer = async (req, res) => {
    try {
        const { id } = req.params;

        const dealer = await User.findOne({
            _id: id,
            role: "dealer",
        });

        if (!dealer) {
            return res.status(404).json({
                message: "Dealer not found",
            });
        }

        if (dealer.status === "rejected") {
            return res.status(400).json({
                message: "Dealer is already rejected",
            });
        }

        dealer.status = "rejected";

        await dealer.save();

        return res.status(200).json({
            message: "Dealer rejected successfully.",

            dealer: {
                _id: dealer._id,
                name: dealer.name,
                email: dealer.email,
                phone: dealer.phone,
                role: dealer.role,
                status: dealer.status,
            },
        });
    } catch (error) {
        console.error(
            "Reject dealer error:",
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
    getDashboardStats,
    getTotalDealers,
    getPendingDealers,
    approveDealer,
    rejectDealer,
};