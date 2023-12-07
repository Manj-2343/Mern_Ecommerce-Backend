import  {  Request, Response } from "express";
import { ThrowError } from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import CartCollection from "../schemas/cartSchema";
import { ICart } from "../models/ICart";
import mongoose from "mongoose";
import { APP_CONSTANTS } from "../constants";
/**
 * usage:Create a Cart
 * url:http://localhost:9999/api/carts/
 * params:products[{product,count,price}],total,tax,grandTotal
 * method: POST,
 * access:Private
 */
export const createCart=async(request:Request, response:Response)=>{
    try {
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
         const {products,total,tax,grandTotal} = request.body;
         //check if the user already have a cart
         const cart = await CartCollection.findOne({userObj:theUser._id.toString()});
        if(cart){
            await CartCollection.findByIdAndDelete(cart._id)
        }
        const newCart:ICart={
            products:products,
            total:total,
            tax:tax,
            grandTotal:grandTotal,
            userObj:theUser._id.toString()
        };
        const theCart = await new CartCollection(newCart).save();
        if(!theCart){
            return response.status(400).json({msg:"Cart Creation is Failed"});
        }
        const actualCart = await CartCollection.findById(new mongoose.Types.ObjectId(theCart._id)).populate({
            path:"userObj",
            strictPopulate:false
        })
        return  response.status(200).json({
            msg:"Cart Creation is Success",
            data:actualCart,
            status:APP_CONSTANTS.Success
        });
    }
    } catch (error) {
        console.error(error);
        return ThrowError(response);
    }
}
/**
 * usage:get cart Info
 * url:http://localhost:9999/api/carts/me
 * params:no-params
 * method: get,
 * access:Private
 */
export const getCartInfo=async(request:Request, response:Response)=>{
    try {
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const theCart:any = await CartCollection.findOne({userObj:new mongoose.Types.ObjectId(theUser._id)}).populate({
                path:"products.product",
                strictPopulate:false
            }).populate({
                path:"userObj",
                strictPopulate:false
            })
            return response.status(200).json({
                status:APP_CONSTANTS.Success,
                data:theCart,
                msg:""
            })
        }
    } catch (error) {
        return ThrowError(response);
    }
}