const express = require("express");

const {

    getDashboardStats,

    getTotalDealers,

    getPendingDealers,

    approveDealer,

    rejectDealer,

} = require("../controllers/admin.controller");


const router = express.Router();


// =========================================================
// ADMIN DASHBOARD STATS
// =========================================================
// Returns:
// totalDealers
// pendingDealers
// totalOrders
// totalRevenue
// =========================================================

router.get(

    "/dashboard-stats",

    getDashboardStats

);


// =========================================================
// GET TOTAL APPROVED DEALERS
// =========================================================

router.get(

    "/dealers/total",

    getTotalDealers

);


// =========================================================
// GET PENDING DEALERS
// =========================================================

router.get(

    "/dealers/pending",

    getPendingDealers

);


// =========================================================
// APPROVE DEALER
// =========================================================

router.patch(

    "/dealers/:id/approve",

    approveDealer

);


// =========================================================
// REJECT DEALER
// =========================================================

router.patch(

    "/dealers/:id/reject",

    rejectDealer

);


// =========================================================
// EXPORT
// =========================================================

module.exports = router;