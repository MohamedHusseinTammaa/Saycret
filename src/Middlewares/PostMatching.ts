import type { NextFunction, Request, Response } from "express";
import Post from "../Domain/Models/Posts.ts";
import { AppError } from "../Utils/AppError.ts";
import * as httpStatus from "../Utils/HttpStatusText.ts";
export const PostMatching = async (req: Request, res: Response, next: NextFunction) => {
    if(req.currentUser?.allowed)return next();
    const user = req.currentUser?.id;
    const postId = req.params.id;
    const matches = await Post.findOne({ _id: postId, writer: user }).lean();
    if (!matches) {
        return next(new AppError("The user is not authorized to do such action", 401, httpStatus.FAIL));
    }
    return next();
};