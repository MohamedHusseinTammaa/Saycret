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

const getAllUsers = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array())
        );
    }

    const users = await User.find().lean();

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: { users },
    });
});

const getUserById = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user: any = await User.findById(id).lean();

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

    let { name: { first, last }, userName, dateOfBirth, gender, phoneNumber, email, password, role } = req.body;
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
        role
    });

    try {
        await newUser.save();
        const user = await User.find({ _id: newUser.id }, { password: 0, __v: 0 });
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
    const user: any = await User.findOne({ email });

    if (!user) {
        return next(new AppError("email and password doesn't match", 400, httpStatus.FAIL));
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (passwordMatched) {
        const token = Jwt.sign({ email: user.email, id: user.id, role: user.role }, process.env.JWT_KEY!);
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

const editUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array())
        );
    }

    const { id } = req.params;
    const { body } = req;

    const updated: any = await User.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();

    if (!updated) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: updated,
    });
});

const deleteUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user: any = await User.findById(id).lean();

    if (!user) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }

    const deleted: any = await User.findByIdAndDelete(id).lean();

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: deleted,
    });
});

export {
    getAllUsers,
    getUserById,
    register,
    editUser,
    login,
    deleteUser
};
