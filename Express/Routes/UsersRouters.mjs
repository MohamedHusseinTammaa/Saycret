import { Router } from "express";
import {checkSchema} from "express-validator";
import { addUserSchema, checkIndex } from "../Middlewares/validationSchemas.mjs";
import { createUser, editUser, getAllUsers, getUserById } from "../Controllers/UsersController.mjs";
const router = Router();

router.get("/",getAllUsers);
router.get("/:id",checkIndex,getUserById);
router.post("/",checkSchema(addUserSchema),createUser);
router.patch('/:id',checkIndex,editUser);
export{router} 
