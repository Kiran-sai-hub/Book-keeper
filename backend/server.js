import dotenv from "dotenv";
dotenv.config();

import express from "express"
import cors from "cors";

import connectDB from "./db/db.js"
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.router.js";
import bookRouter from "./routes/book.router.js";

const app = express()
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/books', bookRouter);


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });