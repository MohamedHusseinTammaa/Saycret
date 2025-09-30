import type{ NextFunction, Request, Response } from "express";
import { AppError } from "../Utils/AppError.ts";
import * as httpStatus from "../Utils/HttpStatusText.ts";

// Middleware to check if ID in params is a number
export const checkIndex = (req: Request, res: Response, next: NextFunction) => {
    const { params: { id } } = req;
    if(!id){
        return next(new AppError("id is required",400,httpStatus.FAIL));
    }
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        return next(new AppError("id must be a number", 400, httpStatus.FAIL));
    }
    next();
};
