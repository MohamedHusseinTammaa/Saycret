import { Router } from "express";
import { createPost, getPostById, getPosts ,editWholePost, editPartPost,deletePost} from "../Controllers/PostsController.mjs"; 
import { createPostSchema , postQuerySchema,checkIndex} from "../Middlewares/validationSchemas.mjs"
import {checkSchema} from "express-validator";
import { verifyToken } from "../Middlewares/verifyToken.mjs";
import {allowedTo} from "../Middlewares/allowedTo.mjs";
import { roles } from "../Utils/usersRoles.mjs";
const router = Router();
//Get all posts
router.get("/",verifyToken,checkSchema(postQuerySchema),getPosts);
//Get all posts by id
router.get("/:id",verifyToken,checkIndex,getPostById);
//create a new post
router.post("/",verifyToken,checkSchema(createPostSchema),createPost);
//edit the whole post
router.put("/:id",verifyToken,checkSchema(createPostSchema),editWholePost);
//edit part of the post
router.patch("/:id",verifyToken,checkIndex,editPartPost);
//delete post
router.delete("/:id",verifyToken,allowedTo(roles.MANAGER,roles.ADMIN),checkIndex,deletePost)
export {router};