import { Router } from "express";
import { createPost,searchPosts, getPostById, getPosts ,editPartPost,deletePost,likePost, disLikePost, removeInteractionPost, getProfilePosts, getPostComments, addComment, deleteComment, updateComment} from "../Controllers/PostsController.ts"; 
import {createCommentSchema, createPostSchema , postQuerySchema} from "../Middlewares/validationSchemas.ts"
import {checkIndex} from "../Middlewares/checkIndex.ts"
import {checkSchema} from "express-validator";
import { verifyToken } from "../Middlewares/verifyToken.ts";
import {allowedTo} from "../Middlewares/allowedTo.ts";
import { PostMatching } from "../Middlewares/PostMatching.ts";
import {Roles} from "../Utils/usersRoles.ts";
const router = Router();
//Get all posts
router.get("/",verifyToken,getPosts);
router.get("/search",verifyToken,checkSchema(postQuerySchema),searchPosts)
//get users posts 
router.get("/profile/:id",verifyToken,getProfilePosts);
//Get all posts by id
router.get("/:id",verifyToken,checkIndex,getPostById);
//Get post comments 
router.get("/comments/:id",verifyToken,checkIndex,getPostComments)
//update comment
router.patch("/comments/:id",verifyToken,checkIndex,updateComment)
//add a comment
router.post("/comments",verifyToken,checkSchema(createCommentSchema),addComment)
//delete a comment 
router.delete("/comments",verifyToken,checkIndex,deleteComment)
//like post
router.post("/like/:id",verifyToken,checkIndex,likePost);
//dislike post
router.post("/dislike/:id",verifyToken,checkIndex,disLikePost);
//remove interaction
router.post("/removeInteraction/:id",verifyToken,checkIndex,removeInteractionPost);
//create a new post
router.post("/",verifyToken,checkSchema(createPostSchema),createPost);
//edit part of the post
router.patch("/:id",verifyToken,PostMatching,checkIndex,editPartPost);
//delete post
router.delete("/:id",verifyToken,allowedTo(Roles.MANAGER,Roles.ADMIN),PostMatching,checkIndex,deletePost);
export {router};