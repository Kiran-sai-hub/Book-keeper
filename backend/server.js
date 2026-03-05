import express from "express"

import connectDB from "../config/db.js"
import cookieParser from "cookie-parser";

const app = express()
const PORT = process.env.PORT || 5001;

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });