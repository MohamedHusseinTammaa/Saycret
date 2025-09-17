import { Router } from "express";
import {checkSchema} from "express-validator";
import {verifyToken} from "../Middlewares/verifyToken.mjs"
import { loginUserSchema ,addUserSchema, checkIndex } from "../Middlewares/validationSchemas.mjs";
import { editUser, getAllUsers, getUserById ,deleteUser, register, login} from "../Controllers/UsersController.mjs";
const router = Router();

router.get("/",getAllUsers);
router.get("/:id",checkIndex,getUserById);
router.post("/register",checkSchema(addUserSchema),register);
router.post("/login",checkSchema(loginUserSchema),login);
router.patch('/:id',checkIndex,editUser);
router.delete('/:id',checkIndex,deleteUser);
export{router} 
