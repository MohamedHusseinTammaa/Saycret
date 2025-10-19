import { Router } from "express";
import {checkSchema} from "express-validator";
import {verifyToken} from "../Middlewares/verifyToken.ts"
import { loginUserSchema ,addUserSchema} from "../Middlewares/validationSchemas.ts";
import {checkIndex} from "../Middlewares/checkIndex.ts"
import { editUser, getAllUsers, getUserById ,deleteUser, register, login} from "../Controllers/UsersController.ts";
import { allowedTo } from "../Middlewares/allowedTo.ts";
import { Roles } from "../Utils/usersRoles.ts";
import multer from "multer";
import {upload} from "../Middlewares/upload.ts";

const router = Router();

router.get("/",verifyToken,allowedTo(Roles.MANAGER,Roles.ADMIN),getAllUsers);
router.get("/:id",verifyToken,checkIndex,getUserById);
router.post("/register",upload.single("avatar"),checkSchema(addUserSchema),register);
router.post("/login",checkSchema(loginUserSchema),login);
router.patch('/:id',verifyToken,allowedTo(Roles.ADMIN,Roles.MANAGER,Roles.USER),checkIndex,editUser);
router.delete('/:id',verifyToken,allowedTo(Roles.ADMIN,Roles.MANAGER,Roles.USER),checkIndex,deleteUser);
export{router} 
