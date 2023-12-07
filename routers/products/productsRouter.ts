import {Router,Request,Response} from 'express';
import {body} from "express-validator"
import { validateForm } from '../../middlewares/validateForm';
import { tokenVerifier } from '../../middlewares/tokenVerifier';
import * as productController  from "../../controllers/productController"

const productRouter:Router =Router();
/**
 * usage:create a Product
 * url:http://localhost:9999/api/products/
 * params: title,description,imageUrl,brand,price,quantity,categoryId,subCategoryId
 * method: post
 * access:Private
 */
productRouter.post("/",[
    body("title").not().isEmpty().withMessage("Title is required"),
    body("description").not().isEmpty().withMessage("Description  is required"),
    body("imageUrl").not().isEmpty().withMessage("ImageUrl  is required"),
    body("brand").not().isEmpty().withMessage("Brand  is required"),
    body("price").not().isEmpty().withMessage("Price  is required"),
    body("quantity").not().isEmpty().withMessage("Quantity  is required"),
    body("categoryId").not().isEmpty().withMessage("CategoryId  is required"),
    body("subCategoryId").not().isEmpty().withMessage("SubCategoryId  is required"),
],tokenVerifier,validateForm,async (request:Request,response:Response)=>{
    await  productController.createProduct(request,response)
});
/**
 * usage:Update a Product
 * url:http://localhost:9999/api/products/:productId
 * params: title,description,imageUrl,brand,price,quantity,categoryId,subCategoryId
 * method: post
 * access:Private
 */
productRouter.put("/:productId",[
    body("title").not().isEmpty().withMessage("Title is required"),
    body("description").not().isEmpty().withMessage("Description  is required"),
    body("imageUrl").not().isEmpty().withMessage("ImageUrl  is required"),
    body("brand").not().isEmpty().withMessage("Brand  is required"),
    body("price").not().isEmpty().withMessage("Price  is required"),
    body("quantity").not().isEmpty().withMessage("Quantity  is required"),
    body("categoryId").not().isEmpty().withMessage("CategoryId  is required"),
    body("subCategoryId").not().isEmpty().withMessage("SubCategoryId  is required"),
],tokenVerifier,validateForm,async (request:Request,response:Response)=>{
    await  productController.updateProduct(request,response)
});
/**
 * usage:get all  Product
 * url:http://localhost:9999/api/products/
 * params: no-params
 * method: get
 * access:Private
 */
productRouter.get("/",tokenVerifier,async (request:Request,response:Response)=>{
    await  productController.getAllProducts(request,response)
});
/**
 * usage:get a  Product
 * url:http://localhost:9999/api/products/:productId
 * params: no-params
 * method: get
 * access:Private
 */
productRouter.get("/:productId",tokenVerifier,async (request:Request,response:Response)=>{
    await  productController.getProduct(request,response)
});
/**
 * usage:Delete a  Product
 * url:http://localhost:9999/api/products/:productId
 * params: no-params
 * method: get
 * access:Private
 */
productRouter.delete("/:productId",tokenVerifier,async (request:Request,response:Response)=>{
    await  productController.deleteProduct(request,response)
});
/**
 * usage:Get all  Product with category Id
 * url:http://localhost:9999/api/products/categories/:categoryId
 * params: no-params
 * method: get
 * access:Private
 */
productRouter.get("/categories/:categoryId",tokenVerifier,async(request:Request,response:Response)=>{
    await productController.getAllProductWithCategoryId(request,response)
});

export default productRouter;