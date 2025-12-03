import { validationResult } from "express-validator";
import { asyncWrapper } from "../Middlewares/Errors/ErrorWrapper.ts";
import * as httpStatus from "../Utils/HttpStatusText.ts";
import * as httpMessage from "../Utils/HttpDataText.ts";
import { AppError } from "../Utils/AppError.ts";
import type { Request, Response, NextFunction } from "express";
import {
    getPostCommentsService,
    addCommentService,
    deleteCommentService,
    updateCommentService,
    likeCommentService,
    dislikeCommentService,
    removeInteractionCommentService,
    getCommentByIdService
} from "../Services/postServices.ts/CommentServices.ts";
// ================= GET COMMENT BY ID =================
const getCommentById = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const comment = await getCommentByIdService(id as string);

    if (!comment) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.NOT_FOUND));
    }

    return res.status(200).json({
        status: httpStatus.SUCCESS,
        data: { comment }
    });
});
// ================= GET POST COMMENTS =================
const getPostComments = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const comments = await getPostCommentsService(id as string, limit, skip);

    if (!comments) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.NOT_FOUND));
    }

    return res.status(200).json({
        status: httpStatus.SUCCESS,
        data: { comments },
        pagination: { limit, page }
    });
})
// ================= add comment =================
const addComment = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL, errors.array()));
    }

    const { content, post, isAnonymous } = req.body;
    const writerId = req.currentUser?.id;

    if (!writerId) {
        return next(new AppError("You must be logged in to interact", 401, httpStatus.FAIL));
    }

    const addedComment = await addCommentService(post, writerId, content, isAnonymous);

    if (!addedComment) {
        return next(new AppError(httpMessage.NOT_VALID, 400, httpStatus.FAIL));
    }

    return res.status(201).json({
        status: httpStatus.SUCCESS,
        data: addedComment
    });
});
// ================= DELETE COMMENT =================
const deleteComment = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
        return next(new AppError(httpMessage.NOT_VALID, 400, httpStatus.FAIL));
    }

    const deletedComment = await deleteCommentService(id);

    if (!deletedComment) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.NOT_FOUND));
    }

    return res.status(200).json({
        status: httpStatus.SUCCESS,
        data: deletedComment
    });
});
// ================= UPDATE COMMENT =================
const updateComment = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!id) {
        return next(new AppError(httpMessage.NOT_VALID, 400, httpStatus.FAIL));
    }

    const updatedComment = await updateCommentService(id, content);

    if (!updatedComment) {
        return next(new AppError(httpMessage.NOT_FOUND, 404, httpStatus.NOT_FOUND));
    }

    return res.status(200).json({
        status: httpStatus.SUCCESS,
        data: updatedComment
    });
});
// ================= LIKE COMMENT =================
const likeComment = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!req.currentUser?.id) {
        return next(new AppError("You must be logged in to interact", 401, httpStatus.FAIL));
    }

    const liked = await likeCommentService(id as string, req.currentUser.id);

    if (!liked) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }

    return res.status(200).end();
});
// ================= DISLIKE COMMENT =================
const dislikeComment = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!req.currentUser?.id) {
        return next(new AppError("You must be logged in to interact", 401, httpStatus.FAIL));
    }

    const disliked = await dislikeCommentService(id as string, req.currentUser.id);

    if (!disliked) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }

    return res.status(200).end();
});
// ================= REMOVE INTERACTION =================
const removeInteractionComment = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!req.currentUser?.id) {
        return next(new AppError("You must be logged in to interact", 401, httpStatus.FAIL));
    }

    const done = await removeInteractionCommentService(id as string, req.currentUser.id);

    if (!done) {
        return next(new AppError(httpMessage.BAD_REQUEST, 400, httpStatus.FAIL));
    }

    return res.status(200).end();
});
export {
    getPostComments,
    addComment,
    deleteComment,
    updateComment,
    likeComment,
    dislikeComment,
    removeInteractionComment,
    getCommentById
};
