import { Router } from "express";
import { createPost,searchPosts, getPostById, getPosts ,editPartPost,deletePost,likePost, disLikePost, removeInteractionPost} from "../Controllers/PostsController.ts"; 
import {createPostSchema , postQuerySchema} from "../Middlewares/validationSchemas.ts"
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
//Get all posts by id
router.get("/:id",verifyToken,checkIndex,getPostById);
//like post
router.post("/like/:id",verifyToken,checkIndex,likePost);
//dislike post
router.post("/dislike/:id",verifyToken,checkIndex,disLikePost);
//
router.post("/removeInteraction/:id",verifyToken,checkIndex,removeInteractionPost);
//create a new post
router.post("/",verifyToken,checkSchema(createPostSchema),createPost);
//edit part of the post
router.patch("/:id",verifyToken,PostMatching,checkIndex,editPartPost);
//delete post
router.delete("/:id",verifyToken,allowedTo(Roles.MANAGER,Roles.ADMIN),PostMatching,checkIndex,deletePost);
export {router};