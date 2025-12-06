import type{ Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { AppError } from "../Utils/AppError.ts";
import * as httpStatus from "../Utils/HttpStatusText.ts";
import type { IUserJWT } from "../DTOs/users/UserJWT.ts";
import blackListedTokenModel from "../Domain/Models/blackListedTokens.ts";
export const verifyToken = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return next(new AppError("The token is required", 401, httpStatus.FAIL));
        }

        if (!authHeader.startsWith("bearer ")) {
            return next(new AppError("The token is invalid", 401, httpStatus.FAIL));
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || !parts[1]) {
            return next(new AppError("The token is invalid", 401, httpStatus.FAIL));
        }

        const token = parts[1];

        const secret = process.env.JWT_KEY;
        if (!secret) {
            return next(new AppError("The server is not configured properly", 500, httpStatus.FAIL));
        }

        try {
            const decoded :IUserJWT = Jwt.verify(token, secret) as IUserJWT;
            const isSessionEnded = await blackListedTokenModel.findOne({
                tokenId: decoded.jti
            });

            if (isSessionEnded) {
                return res.status(401).json({
                    status: "error",
                    message: "your session is ended"
                });
            }
            req.currentUser = {
                ...decoded,
                id: decoded.id
            };
            if(!req.currentUser) return res.status(401).json({
                    status: "error",
                    message: "your session is ended"
                });
            console.log({ user: req.currentUser.id });

            next();
        } catch (err) {
            return next(new AppError("The token is invalid", 401, httpStatus.FAIL));
        }
    } catch (error) {
        return next(new AppError("An error occurred while verifying the token", 500, httpStatus.FAIL));
    }
};
