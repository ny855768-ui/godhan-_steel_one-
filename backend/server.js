const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./src/db/db");

const authRoutes = require("./src/routes/auth.routes");
const productRoutes = require("./src/routes/product.routes");
const adminRoutes = require("./src/routes/admin.routes");
const orderRoutes = require("./src/routes/order.routes");
const adminOrderRoutes = require("./src/routes/adminOrder.routes");


// =========================================================
// LOAD ENVIRONMENT VARIABLES
// =========================================================

dotenv.config();


const app = express();


// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors());

app.use(express.json());


// =========================================================
// ROUTES
// =========================================================


// AUTH

app.use(
    "/api/auth",
    authRoutes
);


// PRODUCTS

app.use(
    "/api/products",
    productRoutes
);


// ADMIN

app.use(
    "/api/admin",
    adminRoutes
);


// DEALER ORDERS

app.use(
    "/api/orders",
    orderRoutes
);


// ADMIN ORDER MANAGEMENT

app.use(
    "/api/admin/orders",
    adminOrderRoutes
);


// =========================================================
// HOME ROUTE
// =========================================================

app.get("/", (req, res) => {

    res.json({

        message:
            "Godhan Order API is running",

    });

});


// =========================================================
// SERVER
// =========================================================

const PORT =
    process.env.PORT || 5000;


const startServer = async () => {

    try {

        await connectDB();


        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running on port ${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Failed to start server:",
            error
        );

        process.exit(1);

    }

};


startServer();