const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./src/models/user.model");

dotenv.config();

const createAdmin = async () => {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log("MongoDB connected");


        // ==========================================
        // ADMIN DETAILS
        // ==========================================

        const phone = "8294465067";

        const password = "Godhan@Admin123";


        // ==========================================
        // CHECK EXISTING USER
        // ==========================================

        let admin = await User.findOne({
            phone,
        });


        // ==========================================
        // IF USER EXISTS
        // ==========================================

        if (admin) {

            if (admin.role !== "admin") {

                console.log(
                    "This phone number already belongs to a dealer."
                );

                process.exit(1);
            }


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            admin.password =
                hashedPassword;

            admin.status =
                "approved";


            await admin.save();


            console.log(
                "Existing admin password updated successfully."
            );

        }


        // ==========================================
        // IF ADMIN DOES NOT EXIST
        // ==========================================

        else {

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            admin = await User.create({

                name: "Godhan Steel Admin",

                email: "admin@godhansteel.com",

                phone : 8294465067,

                aadhaarNumber:
                    "999999999999",

                panNumber:
                    "ADMIN1234A",

                gstNumber: null,

                password:
                    hashedPassword,

                role: "admin",

                status: "approved",

            });


            console.log(
                "New admin created successfully."
            );

        }


        // ==========================================
        // LOGIN DETAILS
        // ==========================================

        console.log("");
        console.log("==============================");
        console.log("ADMIN LOGIN DETAILS");
        console.log("==============================");
        console.log(
            "Phone:",
            phone
        );
        console.log(
            "Password:",
            password
        );
        console.log("==============================");
        console.log("");


        process.exit(0);

    } catch (error) {

        console.error(
            "Create admin error:",
            error
        );

        process.exit(1);
    }
};


createAdmin();