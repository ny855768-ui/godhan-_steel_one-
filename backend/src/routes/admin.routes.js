const express = require("express");

const {

    getDashboardStats,

    getTotalDealers,

    getPendingDealers,

    approveDealer,

    rejectDealer,

} = require("../controllers/admin.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");


const router = express.Router();

router.get(
    "/dashboard-stats",
    authMiddleware,
    adminMiddleware,
    getDashboardStats
);

router.get(
    "/dealers/total",
    authMiddleware,
    adminMiddleware,
    getTotalDealers
);

router.get(
    "/dealers/pending",
    authMiddleware,
    adminMiddleware,
    getPendingDealers
);

router.patch(
    "/dealers/:id/approve",
    authMiddleware,
    adminMiddleware,
    approveDealer
);

router.patch(
    "/dealers/:id/reject",
    authMiddleware,
    adminMiddleware,
    rejectDealer
);

// =========================================================
// EXPORT
// =========================================================

module.exports = router;





curl.exe -X POST "https://api.exotel.com/v1/Accounts/godhansteel1/Sms/send" `
-u "$env:86fa98d8ca2b7ac65a4c08ccef4941f9cf233f091688df0f`:$env:40c0a6ea55f86734be6f424bad3a94bc23c4e6a4364e7486" `
-d "From=EXOSMS" `
-d "To=918294465067" `
-d "Body=This is a test message powered by Exotel. Report abuse to +918088919888 -Exotel"




if ($env:86fa98d8ca2b7ac65a4c08ccef4941f9cf233f091688df0f) { "API Key is loaded" } else { "API Key is NOT loaded" }
if ($env:40c0a6ea55f86734be6f424bad3a94bc23c4e6a4364e7486) { "API Token is loaded" } else { "API Token is NOT loaded" }