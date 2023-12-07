import { Router, Request, Response } from "express";
import { ThrowError } from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import AddressCollection from "../schemas/addressSchema";
import mongoose from "mongoose";
import { IAddress } from "../models/IAddress";
import { APP_CONSTANTS } from "../constants";

/**
 * usage:Create New Address
 * url:http://localhost:9999/api/address/new
 * params:name,email,mobile,flat,landmark,street,city,state,country,pinCode
 * method: POST,
 * access:Private
 */
export const createNewAddress = async (
  request: Request,
  response: Response
) => {
  try {
    const { mobile, flat, landmark, street, city, state, country, pinCode } =
      request.body;
    const theUser: any = await UserUtil.getUser(request, response);
    if (theUser) {
      //check if the address is exists for user
      const addressObj: any = await AddressCollection.findOne({
        userObj: new mongoose.Types.ObjectId(theUser._id),
      });
      if (addressObj) {
        await AddressCollection.findByIdAndDelete(
          new mongoose.Types.ObjectId(addressObj._id)
        );
      } else {
        //create the new address obj
        const theAddress: IAddress = {
          name: theUser.username,
          email: theUser.email,
          mobile: mobile,
          flat: flat,
          landmark: landmark,
          street: street,
          city: city,
          state: state,
          country: country,
          pinCode: pinCode,
          userObj: theUser._id,
        };
        const newAddress = await new AddressCollection(theAddress).save();
        if (newAddress) {
          return response.status(200).json({
            state: APP_CONSTANTS.Success,
            data: newAddress,
            msg: "New Shipping address is added...",
          });
        }
      }
    }
  } catch (error) {
    return ThrowError(response);
  }
};
/**
 * usage:Update Address
 * url:http://localhost:9999/api/address/:addressId
 * params:mobile,flat,landmark,street,city,state,country,pinCode
 * method: PUT,
 * access:Private
 */
export const updateAddress = async (request: Request, response: Response) => {
  try {
    const { addressId } = request.params;
    const mongoAddressId = new mongoose.Types.ObjectId(addressId);
    const { mobile,flat, landmark, street, city, state, country, pinCode } =
      request.body;
      const theUser: any = await UserUtil.getUser(request, response);
      if (theUser) {
        const theAddress: IAddress | undefined | null =
        await AddressCollection.findById(mongoAddressId);
      if (!theAddress) {
        return ThrowError(response, 404, "NO Address Found");
      }
      const addressObj = await AddressCollection.findByIdAndUpdate(mongoAddressId,{
          $set:{
            name: theUser.username,
            email: theUser.email,
            mobile: mobile,
            flat: flat,
            landmark: landmark,
            street: street,
            city: city,
            state: state,
            country: country,
            pinCode: pinCode,
            userObj: theUser._id,
          }
      },{new:true});
      if(addressObj){
        return response.status(200).json({
            status :APP_CONSTANTS.Success,
            data:addressObj,
            msg:"Shipping address is updated"
        })
      }
      }
  } catch (error) {
    return ThrowError(response);
  }
};
/**
 * usage:Get Address
 * url:http://localhost:9999/api/address/me
 * params:no-params
 * method: GET,
 * access:Private
 */
export const getAddress = async (request: Request, response: Response) => {
  try {
    const theUser: any = await UserUtil.getUser(request, response);
      if (theUser) {
        const addressObj:IAddress | undefined | null = await AddressCollection.findOne({
            userObj:new mongoose.Types.ObjectId(theUser._id)  
        });
        if (!addressObj) {
            return ThrowError(response, 404, "NO Address Found");
          } 
          return response.status(200).json({
            status:APP_CONSTANTS.Success,
            data:addressObj,
            msg:"Address Found"
          });
      }
  } catch (error) {
    return ThrowError(response);
  }
};
/**
 * usage:Delete Address
 * url:http://localhost:9999/api/address/:addressId
 * params:no-params
 * method: GET,
 * access:Private
 */
export const deleteAddress = async (request: Request, response: Response) => {
  try {
    const {addressId} = request.params;
    const theUser: any = await UserUtil.getUser(request, response);
    if (theUser) {
        const addressObj:IAddress | undefined | null = await AddressCollection.findById(new mongoose.Types.ObjectId(addressId)); 
        if (!addressObj) {
            return ThrowError(response, 404, "NO Address Found");
          } 
          const theAddress = await AddressCollection.findByIdAndDelete(new mongoose.Types.ObjectId(addressId));
          if(theAddress){
            return response.status(200).json({
                status:APP_CONSTANTS.Success,
                data:theAddress,
                msg:"Shipping address is deleted.."
              });
          }
    }
  } catch (error) {

    return ThrowError(response);
  }
};
