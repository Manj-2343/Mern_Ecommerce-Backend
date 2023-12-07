import {Router,Request,Response} from 'express';
import {body} from "express-validator"
import { validateForm } from '../../middlewares/validateForm';
import { tokenVerifier } from '../../middlewares/tokenVerifier';
import * as cartController from "../../controllers/cartController"
const cartRouter:Router =Router();
/**
 * usage:Create a Cart
 * url:http://localhost:9999/api/carts/
 * params:products[{product,count,price}],total,tax,grandTotal
 * method: POST,
 * access:Private
 */
cartRouter.post("/",[
    body("products").not().isEmpty().withMessage("Product  is required"),
    body("total").not().isEmpty().withMessage("Total  is required"),
    body("tax").not().isEmpty().withMessage("Tax  is required"),
    body("grandTotal").not().isEmpty().withMessage("GrandTotal  is required"),
],tokenVerifier,validateForm,async (request:Request,response:Response)=>{
    await  cartController.createCart(request,response)
});
/**
 * usage:get cart Info
 * url:http://localhost:9999/api/carts/me
 * params:no-params
 * method: get,
 * access:Private
 */
cartRouter.get("/me",tokenVerifier,async (request:Request,response:Response)=>{
    await  cartController.getCartInfo(request,response)
});
export default cartRouter;