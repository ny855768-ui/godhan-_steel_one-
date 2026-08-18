const express = require("express");

const {
    getAdminNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} = require("../controllers/notification.controller");

const authMiddleware =
    require("../middleware/auth.middleware");

const roleMiddleware =
    require("../middleware/role.middleware");

const router = express.Router();

// GET ADMIN NOTIFICATIONS
router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    getAdminNotifications
);

// MARK ONE NOTIFICATION AS READ
router.patch(
    "/admin/:id/read",
    authMiddleware,
    roleMiddleware("admin"),
    markNotificationAsRead
);

// MARK ALL AS READ
router.patch(
    "/admin/read-all",
    authMiddleware,
    roleMiddleware("admin"),
    markAllNotificationsAsRead
);

module.exports = router;