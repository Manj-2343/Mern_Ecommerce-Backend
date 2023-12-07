import {Router,Request,Response} from 'express';
import { tokenVerifier } from '../../middlewares/tokenVerifier';
import * as categoryController from "../../controllers/categoryController"
import {body} from "express-validator"
import { validateForm } from '../../middlewares/validateForm';


const categoryRouter:Router =Router();
/**
 * usage:create a category
 * url:http://localhost:9999/api/categories/
 * params:name,description
 * method: post
 * access:Private
 */
categoryRouter.post("/",[
    body("name").not().isEmpty().withMessage("Name is required"),
    body("description").not().isEmpty().withMessage("Description  is required"),
],tokenVerifier,validateForm,async (request:Request,response:Response)=>{
    await  categoryController.createCategory(request,response)
});
/**
 * usage:create a subCategory
 * url:http://localhost:9999/api/categories/:categoryId
 * params:name,description
 * method: post
 * access:Private
 */
categoryRouter.post("/:categoryId",[
    body("name").not().isEmpty().withMessage("Name is required"),
    body("description").not().isEmpty().withMessage("Description  is required"),
],tokenVerifier,validateForm,async (request:Request,response:Response)=>{
    await  categoryController.createSubCategory(request,response)
});
/**
 * usage:get all  subCategory
 * url:http://localhost:9999/api/categories/
 * params:no-params
 * method: get
 * access:Public
 */
categoryRouter.get("/",async (request:Request,response:Response)=>{
    await  categoryController.getAllCategories(request,response);
});
export default categoryRouter;