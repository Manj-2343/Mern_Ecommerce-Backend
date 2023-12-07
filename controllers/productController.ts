import { ThrowError } from "../util/ErrorUtil";
import {Request,Response} from "express";
import * as UserUtil from "../util/UserUtil";
import ProductCollection from "../schemas/ProductSchema";
import { IProduct } from "../models/IProduct";
import { APP_CONSTANTS } from "../constants";
import mongoose, { Mongoose } from "mongoose";

/**
 * usage:create a Product
 * url:http://localhost:9999/api/products/
 * params: title,description,imageUrl,brand,price,quantity,categoryId,subCategoryId
 * method: post
 * access:Private
 */
export const createProduct =async(request:Request,response:Response)=>{
    try {
    const {title,description,imageUrl,brand,price,quantity,categoryId,subCategoryId} = request.body;
   
    const theUser: any = await UserUtil.getUser(request, response);
      if (theUser) {
 //check if the same product exist
const theProduct:IProduct | undefined | null = await  ProductCollection.findOne({title:title});
if(theProduct){
  return ThrowError(response,401,"The Product is already exists ");
}
const newProduct:IProduct={
  title:title,
  description:description,
  imageUrl:imageUrl,
  brand:brand,
  price:price,
  quantity:quantity,
  categoryObj:categoryId,
  subCategoryObj:subCategoryId,
  userObj:theUser._id
};
const createdProduct = await new ProductCollection(newProduct).save();

if(createdProduct){
  return response.status(200).json({
    status:APP_CONSTANTS.Success,
    data:createdProduct,
    msg:"Product is uploaded successfully!!!"
  })
}
      }
    } catch (error) {
      return ThrowError(response);
    }

};
/**
 * usage:update Product
 * url:http://localhost:9999/api/products/:productId
 * params: title,description,imageUrl,brand,price,quantity,categoryId,subCategoryId
 * method: put
 * access:Private
 */
export const updateProduct =async(request:Request,response:Response)=>{
    try {
      const {title,description,imageUrl,brand,price,quantity,categoryId,subCategoryId} = request.body;
      const {productId} = request.params;
      const mongoProductId = new mongoose.Types.ObjectId(productId);
   
      const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
   //check if the same product exist
  const theProduct:IProduct | undefined | null = await  ProductCollection.findById(mongoProductId);
  if(!theProduct){
    return ThrowError(response,404,"The Product is not exists ");
  }
  const newProduct:IProduct={
    title:title,
    description:description,
    imageUrl:imageUrl,
    brand:brand,
    price:price,
    quantity:quantity,
    categoryObj:categoryId,
    subCategoryObj:subCategoryId,
    userObj:theUser._id
  };
  const updatedProduct = await  ProductCollection.findByIdAndUpdate(mongoProductId,{
    $set:newProduct
  },{new:true})
  
  if(updatedProduct){
    return response.status(200).json({
      status:APP_CONSTANTS.Success,
      data:updatedProduct,
      msg:"Product is updated successfully!!!"
    })
  }
        }
    } catch (error) {
      return ThrowError(response);
    }

};
/**
 * usage:get all  Product
 * url:http://localhost:9999/api/products/
 * params: no-params
 * method: get
 * access:Private
 */
export const getAllProducts =async(request:Request,response:Response)=>{
    try {
      const theUser: any = await UserUtil.getUser(request, response);
      if (theUser) {
        const theProducts:IProduct[] | any = await ProductCollection.find().populate({
          path:"userObj",
          strictPopulate:false,
        }).populate({
          path:"categoryObj",
          strictPopulate:false,
        }).populate({
          path:"subCategoryObj",
          strictPopulate:false,
        });
        return response.status(200).json({
          statusbar :APP_CONSTANTS.Success,
          msg:"",
          data:theProducts
        })
      }
    } catch (error) {
      return ThrowError(response);
    }

};
/**
 * usage:get a  Product
 * url:http://localhost:9999/api/products/:productId
 * params: no-params
 * method: get
 * access:Private
 */
export const getProduct =async(request:Request,response:Response)=>{
    try {
      const {productId} = request.params;
      const mongoProductId = new mongoose.Types.ObjectId(productId)

      const theUser: any = await UserUtil.getUser(request, response);
      if (theUser) {
        const theProduct:IProduct | any = await ProductCollection.findById(mongoProductId).populate({
          path:"userObj",
          strictPopulate:false,
        }).populate({
          path:"categoryObj",
          strictPopulate:false,
        }).populate({
          path:"subCategoryObj",
          strictPopulate:false,
        });
  if(!theProduct){
    return ThrowError(response,404,"Product is not found");
  }
  return response.status(200).json({
    msg:"",
    data:theProduct,
    status:APP_CONSTANTS.Success
  })
      }
    } catch (error) {
      return ThrowError(response);
    }

};
/**
 * usage:Delete a  Product
 * url:http://localhost:9999/api/products/:productId
 * params: no-params
 * method: get
 * access:Private
 */
export const deleteProduct =async(request:Request,response:Response)=>{
    try {
      const {productId} = request.params;
      const mongoProductId = new mongoose.Types.ObjectId(productId)

      const theUser: any = await UserUtil.getUser(request, response);
      if (theUser) {
        const theProduct:IProduct | any = await ProductCollection.findById(mongoProductId).populate({
          path:"userObj",
          strictPopulate:false,
        }).populate({
          path:"categoryObj",
          strictPopulate:false,
        }).populate({
          path:"subCategoryObj",
          strictPopulate:false,
        });
  if(!theProduct){
    return ThrowError(response,404,"Product is not found");
  }
  const deleteProduct =await ProductCollection.findByIdAndDelete(mongoProductId)
  if(deleteProduct) {
    return response.status(200).json({
      msg:" The Product is deleted!!",
      data:deleteProduct,
      status:APP_CONSTANTS.Success
    })
  }
      }
    } catch (error) {
      return ThrowError(response);
    }

};
/**
 * usage:Get all  Product with category Id
 * url:http://localhost:9999/api/products/categories/:categoryId
 * params: no-params
 * method: get
 * access:Private
 */
export const getAllProductWithCategoryId =async(request:Request,response:Response)=>{
    try {
    const {categoryId} = request.params;
    const theUser:any =await UserUtil.getUser(request,response);
    if(theUser){
      const products:IProduct[] | any =await ProductCollection.find({categoryObj:categoryId}).populate({
        path:"userObj",
        strictPopulate:false,
      }).populate({
        path:"categoryObj",
        strictPopulate:false,
      }).populate({
        path:"subCategoryObj",
        strictPopulate:false,
      });
      return response.status(200).json({
       status:APP_CONSTANTS.Success,
       data:products,
       msg:""
      })
    }
    } catch (error) {
      return ThrowError(response);
    }

};