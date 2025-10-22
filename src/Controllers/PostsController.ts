import { validationResult } from "express-validator";
import { asyncWrapper } from "../Middlewares/Errors/ErrorWrapper.ts";
import * as httpStatus from "../Utils/HttpStatusText.ts";
import * as httpMessage from "../Utils/HttpDataText.ts";
import { AppError } from "../Utils/AppError.ts";
import type{ Request, Response, NextFunction } from "express";
import {getPostByIdService, getPostsService, searchPostsService,createPostService,editPartPostService, deletePostService,likePostService, dislikePostService,removeInteractionPostService, getProfilePostsService, getPostCommentsService, addCommentService} from "../Services/postServices.ts/PostServices.ts";
import type{ } from "../Domain/Models/Posts.ts";
const getPosts = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array()));
    }
    const limit:number= Number(req.query.limit) || 10;
    const page :number= Number(req.query.page) || 1;
    const skip :number = (page - 1) * limit;
    const posts= await getPostsService(limit,skip);
    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: { posts },
        pagination: { limit, page }
    });
});

const searchPosts = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array()));
    }

    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const posts= await searchPostsService(limit,skip);
    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: { posts },
        pagination: { limit, page },
    });
});

const getPostById = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const id :string = req.params.id as string;
    const post = await getPostByIdService(id);
    if (!post) {
        return next(new AppError("not found mother fucker", 404, httpStatus.FAIL));
    }
    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: post,
    });
});

const createPost = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array()));
    }
    const { post, isAnonymous } = req.body;
    const createdPost = await createPostService(post,isAnonymous,(req as any).currentUser);
    res.status(201).json({
        status: httpStatus.SUCCESS,
        data: createdPost,
    });
});


const editPartPost = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { body: { post }, params: { id } } = req;
    const edited = await editPartPostService(id,post);
    if (!edited) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }
    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: edited,
    });
});

const deletePost = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deleted: any = await deletePostService(id as string);
    if (!deleted) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.FAIL));
    }
    res.status(200).json({
        data: deleted,
    });
});
const likePost = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if(!req.currentUser||!req.currentUser.id){
        return next(new AppError("you must be logged in to Interact", 401, httpStatus.FAIL));
    }
    const liked: boolean = await likePostService(id as string, req.currentUser.id as string);
    if (!liked) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }   
    res.status(200).end();
});
const disLikePost = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if(!req.currentUser||!req.currentUser.id){
        return next(new AppError("you must be logged in to Interact", 401, httpStatus.FAIL));
    }
    const done: boolean = await dislikePostService(id as string, req.currentUser.id as string);
    if (!done) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }   
    res.status(200).end();
});
const removeInteractionPost = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if(!req.currentUser||!req.currentUser.id){
        return next(new AppError("you must be logged in to Interact", 401, httpStatus.FAIL));
    }
    const done: boolean = await removeInteractionPostService(id as string, req.currentUser.id as string);
    if (!done) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }   
    res.status(200).end();
});
const getProfilePosts = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
      const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array()));
    }
    const limit:number= Number(req.query.limit) || 10;
    const page :number= Number(req.query.page) || 1;
    const skip :number = (page - 1) * limit;
    const posts = await getProfilePostsService(id as string ,limit,skip);
    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: { posts },
        pagination: { limit, page }
    });
});
const getPostComments = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const limit:number= Number(req.query.limit) || 10;
    const page :number= Number(req.query.page) || 1;
    const skip :number = (page - 1) * limit;
    const comments = await getPostCommentsService(id as string ,limit,skip);
    if(!comments) return (new AppError("nigga",404,httpStatus.NOT_FOUND));
    res.status(200).json({
        status: httpStatus.SUCCESS,
        data: { comments },
        pagination: { limit, page }
    });
});
const addComment = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array()));
    }
    const { content,post, isAnonymous } = req.body;
    const writerId= req.currentUser?.id;
    if(!writerId)
        return next(new AppError("you must be logged in to Interact", 401, httpStatus.FAIL));
    
    const addedComment = await addCommentService(post,writerId,content,isAnonymous);
    if(!addedComment) 
        return (new AppError(httpMessage.NOT_VALID,400,httpStatus.FAIL));
    
    res.status(201).json({
        status: httpStatus.SUCCESS,
        data: addedComment,
    });
});
export {
    getPosts,
    searchPosts,
    getPostById,
    createPost,
    editPartPost,
    deletePost,
    likePost,
    disLikePost,
    removeInteractionPost,
    getProfilePosts,
    getPostComments,
    addComment
};
