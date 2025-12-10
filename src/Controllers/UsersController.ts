import { validationResult } from "express-validator";
import User from "../Domain//Models/Users.ts";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import 'dotenv/config';
import { asyncWrapper } from "../Middlewares/Errors/ErrorWrapper.ts";
import * as httpStatus from "../Utils/HttpStatusText.ts";
import * as httpMessage from "../Utils/HttpDataText.ts";
import { AppError } from "../Utils/AppError.ts";
import type{ Request, Response, NextFunction } from "express";
import * as Services  from "../Services/userServices.ts/UserServices.ts";
import { get } from "http";
import { log } from "console";
const getAllUsers = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array())
        );
    }
    
    const users = await Services.getAllUsersService();

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: { users },
    });
});

const getUserById = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if(!id){
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }
    const user: any = await Services.getUserByIdService(id);

    if (!user) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: user,
    });
});

const register = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array()));
    }

    let { name: { first, last }, userName, dateOfBirth, gender, phoneNumber, email, password, role,avatar } = req.body;
    if (dateOfBirth) {
        const [day, month, year] = dateOfBirth.split("-");
        dateOfBirth = new Date(year, month - 1, day);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name: { first, last },
        userName,
        dateOfBirth,
        gender,
        phoneNumber,
        email,
        password: hashedPassword,
        role,
        avatar : req.file?.filename
    });

    try {
        const user: any = await Services.registerService(newUser);
        res.status(201).json({
            status: httpStatus.SUCCESS,
            data: user
        });
    } catch (err: any) {
        if (err.code === 11000) {
            return next(new AppError("The email is already signed", 400, httpStatus.FAIL));
        }
        next(err);
    }
});

const login = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user: any = await Services.loginService(email);

    if (!user) {
        return next(new AppError("email and password doesn't match", 400, httpStatus.FAIL));
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (passwordMatched) {
       if (user.deleted) {
          if (Date.now() <= user.restoreUntil.getTime()) {
            
            const restored = await Services.restoreDeletedUserService(user._id);
            if (!restored) {
              return next(new AppError("Invalid email or password", 401, httpStatus.FAIL));
            }
          } else {
            
            return next(
              new AppError("Your account can no longer be restored", 403, httpStatus.FAIL)
            );
          }
        }

        const token = Jwt.sign({ email: user.email, id: user.id, role: user.role , jti: crypto.randomUUID(), }, process.env.JWT_KEY!);
        return res.status(200).json({
            status: httpStatus.SUCCESS,
            data: user.email,
            message: "successfully signed",
            token: token
        });
    }

    return res.status(400).json({
        status: httpStatus.FAIL,
        data: null,
        message: "email and password doesn't match",
        details: null
    });
});
const logout = asyncWrapper(async (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array())
        );
    }
    const token = req.currentUser
    if(!token)return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    console.log({ tokenJTI: token.jti });

    const data = await Services.blockSessionService(token.jti);
    if(!data) return next(new AppError(httpMessage.ERROR, 500, httpStatus.ERROR));
    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: data,
        message: "logged out successfully"
    });
});
const editUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array())
        );
    }

    const { id } = req.params;
    const { body } = req;
    if(!id||!body){
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }
    const updated: any = await Services.editUserService(id, body);

    if (!updated) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: updated,
    });
});

const deleteUser = asyncWrapper(async (req:Request, res:Response, next:NextFunction) => {
    const  id  = req.currentUser?.id;
    if (!id) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }
    const deleted = await Services.deleteUserService(id);

    if (!deleted) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }
    const token = req.currentUser
    if(!token)return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    console.log({ tokenJTI: token.jti });

    const data = await Services.blockSessionService(token.jti);
    if(!data) return next(new AppError(httpMessage.ERROR, 500, httpStatus.ERROR));

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: deleted,
        token:data,
        days : "you have 30 days to restore your account",
        restore_until :deleted.restoreUntil
    });
});

const getUserFollowersById = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if(!id){
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }
    const limit:number= Number(req.query.limit) || 10;
    const page :number= Number(req.query.page) || 1;
    const skip :number = (page - 1) * limit;

    const followers = await Services.getUserFollowersByIdService(id,limit,skip);

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: followers,
    });
});

const followUserById = asyncWrapper(async (req:Request, res:Response, next:NextFunction) => {
    const followedId  = req.params.id;
    const followerId = req.currentUser?.id;
    if (!followerId||!followedId||followerId===followedId) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }
    const followed = Services.followService(followerId,followedId)
    if(!followed)
        return next(new AppError(httpMessage.NOT_ALLOWED,405,httpStatus.NOT_ALLOWED));
    res.status(200).json({
        status: httpStatus.SUCCESS,
        data : "followed"
    });
});

const unfollowUserById = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const followedId = req.params.id;
    const followerId = req.currentUser?.id;

    // Validate input
    if (!followerId || !followedId || followerId === followedId) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }

    // Call service
    const unfollowed = await Services.unfollowService(followerId, followedId);

    if (!unfollowed) {
        return next(new AppError(httpMessage.NOT_ALLOWED, 405, httpStatus.NOT_ALLOWED));
    }

    // Response
    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: "unfollowed"
    });
});
const searchUsers = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const q = req.query.q as string;

  if (!q) {
    return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
  }

  const users = await Services.searchUsersService(q);

  res.status(200).json({
    status: httpStatus.SUCCESS,
    results: users.length,
    data: users
  });
});


export {
    getAllUsers,
    getUserById,
    register,
    editUser,
    login,
    deleteUser,
    logout,
    followUserById,
    getUserFollowersById,
    unfollowUserById,
    searchUsers
};
