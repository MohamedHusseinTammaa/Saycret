import { Request } from "express";
import type { IUserJWT } from "../src/DTOs/users/UserJWT.ts";
declare global {
  namespace Express {
    interface Request {
      currentUser?:IUserJWT;
    }
  }
}

export {};