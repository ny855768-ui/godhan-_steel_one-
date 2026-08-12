const express = require("express");

const {

    getAllOrders,

    getAdminOrderById,

    updateOrderStatus,

    getOrderStats,

} = require("../controllers/adminOrder.controller");


const router = express.Router();


// =========================================================
// GET ALL ORDERS
// =========================================================

router.get(

    "/",

    getAllOrders

);


// =========================================================
// GET ORDER STATISTICS
// =========================================================

router.get(

    "/stats",

    getOrderStats

);


// =========================================================
// GET SINGLE ORDER
// =========================================================

router.get(

    "/:id",

    getAdminOrderById

);


// =========================================================
// UPDATE ORDER STATUS
// =========================================================

router.patch(

    "/:id/status",

    updateOrderStatus

);


// =========================================================
// EXPORT
// =========================================================

module.exports = router;