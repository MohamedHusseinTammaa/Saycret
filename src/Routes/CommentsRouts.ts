import { Router } from "express";
import {getPostComments, addComment, deleteComment, updateComment, dislikeComment, likeComment, removeInteractionComment} from "../Controllers/CommentsController.ts"; 
import {createCommentSchema} from "../Middlewares/validationSchemas.ts"
import {checkIndex} from "../Middlewares/checkIndex.ts"
import {checkSchema} from "express-validator";
import { verifyToken } from "../Middlewares/verifyToken.ts";
import {allowedTo} from "../Middlewares/allowedTo.ts";
import { PostMatching } from "../Middlewares/PostMatching.ts";
import {Roles} from "../Utils/usersRoles.ts";
import { getCommentById } from "../Controllers/CommentsController.ts";
const router = Router();
//get comment by id
router.get("/:id",verifyToken,checkIndex,getCommentById)
//get post comments 
router.get("/post/:id",verifyToken,checkIndex,getPostComments)
//update comment
router.patch("/:id",verifyToken,checkIndex,updateComment)
//add a comment
router.post("/",verifyToken,checkSchema(createCommentSchema),addComment)
//delete a comment 
router.delete("/",verifyToken,checkIndex,deleteComment)
//like comment
router.post("/like/:id",verifyToken,checkIndex,likeComment);
//dislike Comment
router.post("/dislike/:id",verifyToken,checkIndex,dislikeComment);
//remove interaction
router.post("/removeInteraction/:id",verifyToken,checkIndex,removeInteractionComment);
export {router};