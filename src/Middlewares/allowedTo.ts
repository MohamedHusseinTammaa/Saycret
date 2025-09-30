import type{ Request, Response, NextFunction } from "express";
import { AppError } from "../Utils/AppError.ts";
import * as httpStatus from "../Utils/HttpStatusText.ts";
import { Roles as RolesType } from "../Utils/usersRoles.ts";
import { Roles as usersRoles } from "../Utils/usersRoles.ts"; // the actual enum/object
import type { IUserJWT } from "../DTOs/users/UserJWT.ts";

export const allowedTo = (...allowedRoles:string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser as IUserJWT;

    if (!user) {
      return next(new AppError("User not authenticated", 401, httpStatus.FAIL));
    }

    const role = user.role;

    // If user role is just "USER", allow only for their own ID
    if (role === usersRoles.USER && user.id !== req.params.id) {
      return next(
        new AppError("The user is not authorized to do such action", 401, httpStatus.FAIL)
      );
    }

    // If user role is not in the allowed roles
    if (!allowedRoles.includes(role)) {
      return next(
        new AppError("The user is not authorized to do such action", 401, httpStatus.FAIL)
      );
    }

    next();
  };
};
