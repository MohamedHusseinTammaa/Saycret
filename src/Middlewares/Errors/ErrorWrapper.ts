import type{ Request,Response,NextFunction } from "express";
import { AppError } from "../../Utils/AppError.ts"; 

export const asyncWrapper = (fn:unknown)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            if(typeof fn !== "function") {
                throw new Error("Provided argument is not a function");
            }
            await fn(req,res,next);
        }
        catch(err){
            next(err);
        }
    }
}