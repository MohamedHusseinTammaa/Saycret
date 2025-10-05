import type{ Request, Response, NextFunction } from "express";
import { AppError } from "../Utils/AppError.ts";
import * as httpStatus from "../Utils/HttpStatusText.ts";
import { Roles as usersRoles } from "../Utils/usersRoles.ts"; 
import type { IUserJWT } from "../DTOs/users/UserJWT.ts";

// middleware to dedicated for allowed roles admin and manager to access certain routes

export const allowedTo = (...allowedRoles:string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser as IUserJWT;

    if (!user) {
      return next(new AppError("User not authenticated", 401, httpStatus.FAIL));
    }

    const role = user.role;
    if (!allowedRoles.includes(role)&& role!==usersRoles.USER) {
      return next(
        new AppError("The user is not authorized not in the allowed roles", 401, httpStatus.FAIL)
      );
    }
    if (req.currentUser!=null && (role === usersRoles.ADMIN || role === usersRoles.MANAGER)) {
      req.currentUser.allowed = true;
    }
    next();
  };
};
