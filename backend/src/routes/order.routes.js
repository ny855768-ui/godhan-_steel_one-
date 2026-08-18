const express = require("express");


const {

    createOrder,

    getMyOrders,

    getAllOrdersForAdmin,

    updateOrderStatus,

    getOrderStats,

} = require("../controllers/order.controller");


const authMiddleware =
    require("../middleware/auth.middleware");

const adminMiddleware =
    require("../middleware/admin.middleware");


const router = express.Router();



// ==========================================
// DEALER
// CREATE ORDER
// POST /api/orders/create
// ==========================================

router.post(

    "/create",

    authMiddleware,

    createOrder

);



// ==========================================
// DEALER
// GET MY ORDERS
// GET /api/orders/my-orders
// ==========================================

router.get(

    "/my-orders",

    authMiddleware,

    getMyOrders

);



// ==========================================
// ADMIN
// GET ALL ORDERS
// GET /api/orders/admin/all
// ==========================================

router.get(
    "/admin/all",
    authMiddleware,
    adminMiddleware,
    getAllOrdersForAdmin
);


// ==========================================
// ADMIN
// GET ORDER STATISTICS
// GET /api/orders/admin/stats
// ==========================================

router.get(
    "/admin/stats",
    authMiddleware,
    adminMiddleware,
    getOrderStats
);



// ==========================================
// ADMIN
// UPDATE ORDER STATUS
// PATCH /api/orders/admin/:orderId/status
// ==========================================

router.patch(
    "/admin/:orderId/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);


// ==========================================
// EXPORT
// ==========================================

module.exports = router;