import { ThrowError } from "../util/ErrorUtil";
import {Request,Response} from "express";
import * as UserUtil from "../util/UserUtil";
import { ICategory, ISubCategory } from "../models/ICategory";
import { CategoryCollection, SubCategoryCollection } from "../schemas/categorySchema";
import { APP_CONSTANTS } from "../constants";
import mongoose from "mongoose";

/**
 * usage:create a category
 * url:http://localhost:9999/api/categories/
 * params:name,description
 * method: post
 * access:Private
 */
export const createCategory =async(request:Request,response:Response)=>{
    try {
    const {name,description} = request.body;
    const theUser: any = await UserUtil.getUser(request, response);
    if (theUser) {
          //check if the category exists
          const categoryObj:ICategory | undefined | null = await CategoryCollection.findOne({ name:name})
          if (categoryObj) {
            return ThrowError(response,401,"Category is already exists!!");
          }
          //create the fresh category
          const theCategory:ICategory={
            name: name,
            description: description,
            subCategories:[] as ISubCategory[]
          }
          const savedCategory = await new CategoryCollection(theCategory).save();
          if(savedCategory){
            return response.status(200).json({
              status:APP_CONSTANTS.Success,
              data:savedCategory,
              msg:"New Category is Created"
            })
          }
    }
    } catch (error) {
      return ThrowError(response);
    }
};
/**
 * usage:create a subCategory
 * url:http://localhost:9999/api/categories/:categoryId
 * params:name,description
 * method: post
 * access:Private
 */
export const createSubCategory =async(request:Request,response:Response)=>{
    try {
      const {categoryId} = request.params;
      const mongoCategoryId = new mongoose.Types.ObjectId(categoryId);

      const {name,description} = request.body;
      const theUser: any = await UserUtil.getUser(request, response);
      if (theUser) {
        //check the subcategory exist or not 
       let theCategory :any =await CategoryCollection.findById(mongoCategoryId);
       if(!theCategory){
        return  ThrowError(response,401,"Category is not Exist");
       }
       let theSubCategory:any = await SubCategoryCollection.findOne({name:name});
       if(theSubCategory){
        return  ThrowError(response,401,"SubCategory is already  Exist");
       }
       //create a sub category
       let theSub = await new  SubCategoryCollection({name:name,description:description}).save();
       if(theSub){
        theCategory.subCategories.push(theSub);
        let categoryObj = await theCategory.save();
        if(categoryObj){
          return response.status(201).json({
            msg:"Sub Category is Created!!",
            status:APP_CONSTANTS.Success,
             data:categoryObj
          })
        }
       }
      }
    } catch (error) {
      return ThrowError(response);
    }

};
/**
 * usage:get all Category
 * url:http:// localhost:9999/api/categories/
 * params:no-params
 * method: get
 * access:Public
 */
export const getAllCategories=async(request:Request,response:Response)=>{
    try {
    const categories = await CategoryCollection.find().populate({
      path:"subCategories",
      strictPopulate:false
    });
    return response.status(200).json({
      status:APP_CONSTANTS.Success,
      data:categories,
      msg:"Categories  Found"
    });
    } catch (error) {
      return ThrowError(response, 500, "Error retrieving categories", error);
    }

};