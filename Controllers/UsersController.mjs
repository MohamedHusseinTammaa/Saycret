import { validationResult } from "express-validator";
import User from "../Models/Users.mjs";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs";
import 'dotenv/config';
import { asyncWrapper } from "../Middlewares/Errors/ErrorWrapper.mjs";
import * as httpStatus from "../Utils/HttpStatusText.mjs";
import * as httpMessage from "../Utils/HttpDataText.mjs";
import { AppError } from "../Utils/AppError.mjs";

const getAllUsers = asyncWrapper(async (req, res, next) => {
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
const getUserById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).lean();

    if (!user) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: user,
    });
});
const register = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array()));
    }
    let  {name:{first,last},userName,dateOfBirth,gender,phoneNumber,email,password,role } = req.body;
    if (dateOfBirth) {
        const [day, month, year] = dateOfBirth.split("-");
        dateOfBirth = new Date(year, month - 1, day);
    }
    const hashedPassword = await bcrypt.hash(password,10);
    try {     
        const newUser = new User({
            name:{first,last},
            userName,
            dateOfBirth,
            gender,
            phoneNumber,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();
        const user = await User.find({ _id: newUser.id }, { password: 0, __v: 0 });
        res.status(201).json({
            status: httpStatus.SUCCESS,
            data: user
        });
    } catch (err) {
        if (err.code === 11000) {
            return next(new AppError("The email is already signed", 400, httpStatus.FAIL));
        }
    }
});
const login = asyncWrapper (async(req,res,next)=>{
    
    const {email,password} = req.body;
    const user = await User.findOne({ email:email});
    if(!user){
        return next(new AppError("email and password doesn't match",400,httpStatus.FAIL));
    }
    const passwordMatched=await bcrypt.compare(password,user.password);
    if(passwordMatched){
        const token = await Jwt.sign({email:user.email,id:user.id,role:user.role},process.env.JWT_KEY);
        return res.status(200).json({
            status: httpStatus.SUCCESS,
            data: user.email,
            message :"successfully signed",
            token : token
        });
    }
    return res.status(400).json({
        status: httpStatus.FAIL,
        data:null,
        message :"email and password doesn't match",
        details:null
    });
});
const editUser = asyncWrapper(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array())
        );
    }

    const { id } = req.params;
    const { body } = req;

    const updated = await User.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();

    if (!updated) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: updated,
    });
});
const deleteUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).lean();

    if (!user) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }

    const deleted = await User.findByIdAndDelete(id).lean();

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
