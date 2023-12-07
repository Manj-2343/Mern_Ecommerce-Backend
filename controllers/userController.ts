import { Request, Response } from "express";

import { ThrowError } from "../util/ErrorUtil";
import UserCollection from "../schemas/userSchema";
import { APP_CONSTANTS } from "../constants";
import * as gravatar from "gravatar";
import * as bcryptjs from "bcryptjs";
import { IUser } from "../models/IUser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import * as UserUtil from "../util/UserUtil";

/**
 * usage:Register  a User
 * url:http://localhost:9999/api/users/register
 * params:username,email,password
 * method: POST,
 * access:Public
 */
export const registerUser = async (request: Request, response: Response) => {
  try {
    let { username, email, password } = request.body;

    // check if the user exists
    let userObj = await UserCollection.findOne({ email: email });
    if (userObj) {
      return response.status(401).json({
        msg: "userAlready exists",
        data: null,
        statusbar: APP_CONSTANTS.FAILED,
      });
    }

    // Get the gravatar url
    let imageUrl: string = gravatar.url(email, {
      size: "200",
      rating: "pg",
      default: "mm",
    });

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // Create a user
    let newUser: IUser = {
      username: username,
      email: email,
      password: hashPassword,
      imageUrl: imageUrl,
    };

    let user = await new UserCollection(newUser).save();
    if (user) {
      return response.status(201).json({
        msg: "Registration is Success",
        data:null,
        status:APP_CONSTANTS.Success
      });
    }
  } catch (error) {
    return ThrowError(response);
  }
};
/**
 * usage:Login  a User
 * url:http://localhost:9999/api/users/login
 * params:username,email,password
 * method: POST,
 * access:Public
 */
export const loginUser = async (request: Request, response: Response) => {
  try {
    let { email, password } = request.body;
    //verify email,password
    let userObj = await UserCollection.findOne({ email: email });
    if (!userObj) {
      return response.status(401).json({
        msg: "Invalid Password",
        data: null,
        status: APP_CONSTANTS.FAILED,
      });
    }
    let isMatch: boolean = await bcryptjs.compare(password, userObj.password);
    if (!isMatch) {
      return response.status(401).json({
        msg: "Invalid Credential",
        data: null,
        status: APP_CONSTANTS.FAILED,
      });
    }
    //create token & send
    let payload = {
      id: userObj._id,
      email: userObj.email,
    };
    let secreteKey: string | undefined = process.env.EXPRESS_APP_JWT_SECRET_KEY;
    if (payload && secreteKey) {
      let token = jwt.sign(payload, secreteKey, {
        expiresIn: 10000000,
      });
      return response.status(200).json({
        msg: "Login is Success",
        token: token,
        data: userObj,
        status:APP_CONSTANTS.Success
      });
    }
  } catch (error) {
    return ThrowError(response);
  }
};
/**
 * usage:get all User data
 * url:http://localhost:9999/api/users/me
 * params:no-params
 * method: get
 * access:Private
 */
export const getUsersData = async (request: Request, response: Response) => {
  try {
    // check if the user exists
    const theUser = await UserUtil.getUser(request, response);
    if (theUser) {
      response.status(200).json({
        data: theUser,
        status: APP_CONSTANTS.Success,
        msg: "",
      });
    }
  } catch (error) {
    return ThrowError(response);
  }
};
/**
 * usage:update Profile Picture
 * url:http://localhost:9999/api/users/profile
 * params:imageUrl
 * method: post
 * access:Private
 */
export const updateProfilePicture = async (
  request: Request,
  response: Response
) => {
  try {
    const { imageUrl } = request.body;
    const theUser: any = await UserUtil.getUser(request, response);

    if (theUser) {
      theUser.imageUrl = imageUrl;
      const userObj = await theUser.save();
      if (userObj) {
        response.status(200).json({
          status: APP_CONSTANTS.Success,
          msg: "Profile Picture is Updated",
          data: userObj,
        });
      }
    }
  } catch (error) {
    return ThrowError(response);
  }
};
/**
 * usage:change The Password
 * url:http://localhost:9999/api/users/change-Password
 * params:password
 * method: post
 * access:Private
 */
export const changePassword = async (request: Request, response: Response) => {
  try {
    const {password} = request.body;
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password,salt);
   
    const theUser: any = await UserUtil.getUser(request, response);
    if (theUser) {
     theUser.password = hashPassword;
     const userObj = await theUser.save();
     if(userObj){
      return response.status(200).json({
        statusbar:APP_CONSTANTS.Success,
        msg:"Password is Changed",
        data:userObj
      })
     }
    }
  } catch (error) {
    return ThrowError(response);
  }
};
