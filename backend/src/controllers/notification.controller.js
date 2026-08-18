const Notification = require("../models/notification.model");


// =========================================================
// GET ADMIN NOTIFICATIONS
// =========================================================
// GET /api/notifications/admin
// =========================================================

const getAdminNotifications = async (req, res) => {

    try {

        // ================================================
        // ADMIN CHECK
        // ================================================

        if (
            !req.user ||
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                message:
                    "Access denied. Admin only.",

            });

        }


        // ================================================
        // GET NOTIFICATIONS
        // ================================================

        const notifications =
            await Notification.find()

                .populate(
                    "dealer",
                    "name phone email"
                )

                .populate(
                    "order",
                    "product quantity unit totalAmount status"
                )

                .sort({
                    createdAt: -1,
                })

                .limit(50);


        // ================================================
        // UNREAD COUNT
        // ================================================

        const unreadCount =
            await Notification.countDocuments({
                isRead: false,
            });


        // ================================================
        // RESPONSE
        // ================================================

        return res.status(200).json({

            message:
                "Notifications fetched successfully",

            notifications,

            unreadCount,

        });

    } catch (error) {

        console.error(
            "Get admin notifications error:",
            error
        );


        return res.status(500).json({

            message: "Server error",

            error: error.message,

        });

    }

};


// =========================================================
// MARK ONE NOTIFICATION AS READ
// =========================================================
// PATCH /api/notifications/admin/:id/read
// =========================================================

const markNotificationAsRead = async (
    req,
    res
) => {

    try {

        // ================================================
        // ADMIN CHECK
        // ================================================

        if (
            !req.user ||
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                message:
                    "Access denied. Admin only.",

            });

        }


        const { id } = req.params;


        // ================================================
        // FIND NOTIFICATION
        // ================================================

        const notification =
            await Notification.findById(id);


        if (!notification) {

            return res.status(404).json({

                message:
                    "Notification not found",

            });

        }


        // ================================================
        // MARK AS READ
        // ================================================

        notification.isRead = true;

        await notification.save();


        return res.status(200).json({

            message:
                "Notification marked as read",

            notification,

        });

    } catch (error) {

        console.error(
            "Mark notification read error:",
            error
        );


        return res.status(500).json({

            message: "Server error",

            error: error.message,

        });

    }

};


// =========================================================
// MARK ALL NOTIFICATIONS AS READ
// =========================================================
// PATCH /api/notifications/admin/read-all
// =========================================================

const markAllNotificationsAsRead = async (
    req,
    res
) => {

    try {

        // ================================================
        // ADMIN CHECK
        // ================================================

        if (
            !req.user ||
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                message:
                    "Access denied. Admin only.",

            });

        }


        await Notification.updateMany(

            {
                isRead: false,
            },

            {
                $set: {
                    isRead: true,
                },
            }

        );


        return res.status(200).json({

            message:
                "All notifications marked as read",

        });

    } catch (error) {

        console.error(
            "Mark all notifications read error:",
            error
        );


        return res.status(500).json({

            message: "Server error",

            error: error.message,

        });

    }

};


// =========================================================
// EXPORT
// =========================================================

module.exports = {

    getAdminNotifications,

    markNotificationAsRead,

    markAllNotificationsAsRead,

};