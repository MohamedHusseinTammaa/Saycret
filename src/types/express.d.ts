import { IUserJWT } from "../DTOs/users/UserJWT.ts";

declare module "express-serve-static-core" {
    interface Request {
        currentUser?: IUserJWT;
    }
}