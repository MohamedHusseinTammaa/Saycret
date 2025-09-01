import { Router } from "express";
import { createPost, getPostById, getPosts ,editWholePost, editPartPost} from "../Controllers/PostsController.mjs"; 
import { createPostSchema , postQuerySchema,checkIndex} from "../Middlewares/validationSchemas.mjs"
import {checkSchema} from "express-validator";

const router = Router();
//Get all posts
router.get("/",checkSchema(postQuerySchema),getPosts);
//Get all posts by id
router.get("/:id",checkIndex,getPostById);
//create a new post
router.post("/",checkSchema(createPostSchema),createPost);
//edit the whole post
router.put("/:id",checkIndex,checkSchema(createPostSchema),checkIndex,editWholePost);
//edit part of the post
router.patch("/:id",checkIndex,editPartPost);

export {router};