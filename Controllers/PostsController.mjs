import { validationResult } from "express-validator";
import Post from "../Models/Posts.mjs";
import { asyncWrapper } from "../Middlewares/Errors/ErrorWrapper.mjs";
import * as httpStatus from "../Utils/HttpStatusText.mjs";
import * as httpMessage from "../Utils/HttpDataText.mjs";
import { AppError } from "../Utils/AppError.mjs";

const getPosts = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array()));
    }

    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    let projection = {
      __v: 0
    };
    let posts = await Post.find(projection).populate({path: "writer",select:"name.first name.last"}).limit(limit).skip(skip).lean();
    posts.forEach(element => {
        if(element.isAnonymous===true){
            element.writer="Anonymous";
        }
        delete element.isAnonymous;
    });

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: { posts },
        pagination: { limit, page }
    });
});

const searchPosts = asyncWrapper(async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array()));
    }

    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    let projection = {
      __v: 0
    };
    let posts = await Post.find(projection).populate({path: "writer",select:"name.first name.last"}).limit(limit).skip(skip).lean();
    posts.forEach(element => {
        if(element.isAnonymous===true){
            element.writer="Anonymous";
        }
        delete element.isAnonymous;
    });

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: { posts },
        pagination: { limit, page },
    });
    
})
const getPostById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const pos = await Post.findById(id,{"__v":0}).populate({path:"writer",select:"name.first name.last"}).lean();
    if(pos.isAnonymous===true){
        pos.writer="Anonymous";
        delete pos.isAnonymous;
    }

    if (!pos) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: pos,
    });
});

const createPost = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array())
        );
    }
    const {post,isAnonymous} = req.body;
    const newPost = await Post.create({
        post: post,
        isAnonymous: isAnonymous,
        writer: req.currentUser.id
      });
      
    let projection = {
      isAnonymous: 0,
      __v: 0
    };
    
    if (newPost.isAnonymous) {
      projection.writer = 0;
    }
    
    const data = await Post.find({
      _id: newPost.id
    }, projection).populate({path: "writer",select:"name.first name.last"});
      
    res.status(201).json({
        status: httpStatus.SUCCESS,
        data: data,
    });
});

const editWholePost = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array())
        );
    }

    const { body, params: { id } } = req;
    const edited = await Post.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();

    if (!edited) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: edited,
    });
});

const editPartPost = asyncWrapper(async (req, res, next) => {
    const { body : {post}, params: { id } } = req;
    const pos = await Post.findById(id).lean();

    if (!pos) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }

    const edited = await Post.findByIdAndUpdate(
        id,
        { $set: { post } },
        { new: true, lean: true }
    );

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: edited,
    });
});

const deletePost = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const pos = await Post.findById(id).lean();

    if (!pos) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }

    const deleted = await Post.findByIdAndDelete(id).lean();

    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: deleted,
    });
});

export {
    getPosts,
    searchPosts,
    getPostById,
    createPost,
    editWholePost,
    editPartPost,
    deletePost
};
