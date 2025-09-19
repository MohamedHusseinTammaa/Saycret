import { Router } from "express";
import {checkSchema} from "express-validator";
import {verifyToken} from "../Middlewares/verifyToken.mjs"
import { loginUserSchema ,addUserSchema, checkIndex } from "../Middlewares/validationSchemas.mjs";
import { editUser, getAllUsers, getUserById ,deleteUser, register, login} from "../Controllers/UsersController.mjs";
import { allowedTo } from "../Middlewares/allowedTo.mjs";
import { roles } from "../Utils/usersRoles.mjs";
const router = Router();

router.get("/",verifyToken,allowedTo(roles.MANAGER,roles.ADMIN),getAllUsers);
router.get("/:id",verifyToken,checkIndex,getUserById);
router.post("/register",checkSchema(addUserSchema),register);
router.post("/login",checkSchema(loginUserSchema),login);
router.patch('/:id',verifyToken,allowedTo(roles.ADMIN,roles.MANAGER,roles.USER),checkIndex,editUser);
router.delete('/:id',verifyToken,allowedTo(roles.ADMIN,roles.MANAGER,roles.USER),checkIndex,deleteUser);
export{router} 
