import { Router } from "express";
import { createPost,searchPosts, getPostById, getPosts ,editWholePost, editPartPost,deletePost} from "../Controllers/PostsController.ts"; 
import {createPostSchema , postQuerySchema} from "../Middlewares/validationSchemas.ts"
import {checkIndex} from "../Middlewares/checkIndex.ts"
import {checkSchema} from "express-validator";
import { verifyToken } from "../Middlewares/verifyToken.ts";
import {allowedTo} from "../Middlewares/allowedTo.ts";
import {Roles} from "../Utils/usersRoles.ts";
const router = Router();
//Get all posts
router.get("/",verifyToken,getPosts);
router.get("/search",verifyToken,checkSchema(postQuerySchema),searchPosts)
//Get all posts by id
router.get("/:id",verifyToken,checkIndex,getPostById);
//create a new post
router.post("/",verifyToken,checkSchema(createPostSchema),createPost);
//edit the whole post
router.put("/:id",verifyToken,checkSchema(createPostSchema),editWholePost);
//edit part of the post
router.patch("/:id",verifyToken,allowedTo(Roles.USER),checkIndex,editPartPost);
//delete post
router.delete("/:id",verifyToken,allowedTo(Roles.MANAGER,Roles.ADMIN),checkIndex,deletePost)
export {router};