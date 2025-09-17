import Jwt from "jsonwebtoken";
import { AppError } from "../Utils/AppError.mjs";
import * as httpStatus from "../Utils/HttpStatusText.mjs";
export const verifyToken = (req,res,next) =>{
    const authHeader= req.headers["Authorization"]||req.headers["authorization"];
    if(!authHeader){
        const error= new AppError("the token is required",401,httpStatus.FAIL);
        return next(error);
    }
    const token = authHeader.split(" ")[1];
    try{
        Jwt.verify(token,process.env.JWT_KEY);
        return next();
    }catch(err){
        const error= new AppError("the token is invalid",401,httpStatus.FAIL);
        next(error);
    }
};