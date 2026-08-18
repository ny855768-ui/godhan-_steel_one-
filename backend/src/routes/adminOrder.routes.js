const express = require("express");

const {

    getAllOrders,

    getAdminOrderById,

    updateOrderStatus,

    getOrderStats,

} = require("../controllers/adminOrder.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const router = express.Router();


// =========================================================
// GET ALL ORDERS
// =========================================================

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);


// =========================================================
// GET ORDER STATISTICS
// =========================================================

router.get(
    "/stats",
    authMiddleware,
    adminMiddleware,
    getOrderStats
);

// =========================================================
// GET SINGLE ORDER
// =========================================================

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getAdminOrderById
);

// =========================================================
// UPDATE ORDER STATUS
// =========================================================

router.patch(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);


// =========================================================
// EXPORT
// =========================================================

module.exports = router;