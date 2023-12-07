import {Router,Request,Response} from 'express';
import {body} from "express-validator"
import { validateForm } from '../../middlewares/validateForm';
import { tokenVerifier } from '../../middlewares/tokenVerifier';
import * as orderController from "../../controllers/orderController"
const orderRouter:Router =Router();

/**
 * usage:place Order
 * url:http://localhost:9999/api/orders/place
 * params:products[{product,count,price}],total,tax,grandTotal,paymentType
 * method: POST,
 * access:Private
 */

orderRouter.post("/place",[
    body("products").not().isEmpty().withMessage("Product  is required"),
    body("total").not().isEmpty().withMessage("Total  is required"),
    body("tax").not().isEmpty().withMessage("Tax  is required"),
    body("grandTotal").not().isEmpty().withMessage("GrandTotal  is required"),
    body("paymentType").not().isEmpty().withMessage("GrandTotal  is required"),
],tokenVerifier,validateForm,async (request:Request,response:Response)=>{
    await  orderController.placeOrders(request,response)
});
/**
 * usage:getAllOrders
 * url:http://localhost:9999/api/orders/all
 * params:no-params
 * method: get,
 * access:Private
 */
orderRouter.get("/all",tokenVerifier,async (request:Request,response:Response)=>{
    await  orderController.getAllOrders(request,response)
});
/**
 * usage:getMyOrders
 * url:http://localhost:9999/api/orders/me
 * params:no-params
 * method: GET,
 * access:Private
 */
orderRouter.get("/me",tokenVerifier,async (request:Request,response:Response)=>{
    await  orderController.getMyOrders(request,response)
});
/**
 * usage:update Order status
 * url:http://localhost:9999/api/orders/:orderId
 * params:orderStatus
 * method: post
 * access:Private
 */
orderRouter.post("/:orderId",[
    body("orderStatus").not().isEmpty().withMessage("OrderStatus is required"),  
],tokenVerifier,validateForm,async (request:Request,response:Response)=>{
    await  orderController.updateOrderStatus(request,response)
});
export default orderRouter;