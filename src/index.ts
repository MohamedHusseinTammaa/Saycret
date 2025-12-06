import express from "express";
import type { NextFunction, Request, Response } from "express";
import { router as PostsRouter } from "./Routes/PostsRouts.ts";
import { router as usersRouter } from "./Routes/UsersRouters.ts";
import { router as commentsRouter } from "./Routes/CommentsRouts.ts";
import { AppError } from "./Utils/AppError.ts";
import * as httpStatus from "./Utils/HttpStatusText.ts";
import * as httpMessages from "./Utils/HttpDataText.ts";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";
import path from "path";

const url = process.env.DB_URL;
if (!url) {
    throw new Error("MONGODB URL is not defined in .env");
}

mongoose.connect(url)
    .then(() => console.log("MongoDB is connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const port = process.env.PORT ? Number(process.env.PORT) : 5000;
const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join( 'uploads')));


// Routes
app.use("/api/posts", PostsRouter);
app.use("/api/comment", commentsRouter);
app.use("/api/users", usersRouter);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: httpStatus.NOT_FOUND,
        data: null,
        message: httpMessages.NOT_FOUND
    });
});

// Error handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
        status: err.statusText || "error",
        data: null,
        message: err.message || "Internal Server Error",
        details: err.details
    });
});

// Start server
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
