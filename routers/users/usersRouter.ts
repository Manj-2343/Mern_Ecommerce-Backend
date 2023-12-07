import {Router,Request,Response} from 'express';
import { tokenVerifier } from '../../middlewares/tokenVerifier';
import { validateForm } from '../../middlewares/validateForm';
import * as userController from "../../controllers/userController";
import {body} from "express-validator"

const userRouter:Router =Router();
/**
 * usage:Register  a User
 * url:http://localhost:9999/api/users/register
 * params:username,email,password
 * method: POST,
 * access:Public
 */
userRouter.post("/register",[
    body("username").not().isEmpty().withMessage("UserName is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isStrongPassword().withMessage(" Strong password is required"),
],validateForm,async (request:Request,response:Response)=>{
    await  userController.registerUser(request,response)
});
/**
 * usage:Login  a User
 * url:http://localhost:9999/api/users/login
 * params:username,email,password
 * method: POST,
 * access:Public
 */
userRouter.post("/login",[
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isStrongPassword().withMessage(" Strong password is required"),
],validateForm,async (request:Request,response:Response)=>{
    await  userController.loginUser(request,response)
});
/**
 * usage:get all User data
 * url:http://localhost:9999/api/users/me
 * params:no-params
 * method: get
 * access:Private
 */
userRouter.get("/me",tokenVerifier,async (request:Request,response:Response)=>{
    await  userController.getUsersData(request,response)
});
/**
 * usage:update Profile Picture
 * url:http://localhost:9999/api/users/profile
 * params:imageUrl
 * method: post
 * access:Private
 */
userRouter.post("/profile",[
    body("imageUrl").not().isEmpty().withMessage("ImageUrl  is required"),
],tokenVerifier,validateForm,async (request:Request,response:Response)=>{
    await  userController.updateProfilePicture(request,response)
});
/**
 * usage:change The Password
 * url:http://localhost:9999/api/users/change-password
 * params:password
 * method: post
 * access:Private
 */
userRouter.post("/change-password",[
    body("password").isStrongPassword().withMessage(" Strong password is required"),
],tokenVerifier,validateForm,async (request:Request,response:Response)=>{
    await  userController.changePassword(request,response)
});
export default userRouter;