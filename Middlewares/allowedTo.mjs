import { AppError } from "../Utils/AppError.mjs";
import * as httpStatus from "../Utils/HttpStatusText.mjs"
import * as usersRoles from "../Utils/usersRoles.mjs";

export const allowedTo= (...roles)=>{
    return (req,res,next)=>{
        const role= req.currentUser.role;
        if(role === usersRoles.roles.USER){
            if(req.currentUser.id !== req.params["id"])
            return  next(new AppError("the user is not autherized to do such action",401,httpStatus.FAIL));
        }
        if(!roles.includes(role)){
            const error=new AppError("the user is not autherized to do such action",401,httpStatus.FAIL);
            return next(error);
        }
        next();
        
    }
}