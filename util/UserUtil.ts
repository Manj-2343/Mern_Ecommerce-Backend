import { Request, Response } from "express";
import mongoose from "mongoose";
import UserCollection from "../schemas/userSchema";
import { ThrowError } from "./ErrorUtil";

export const getUser = async (request: Request, response: Response) => {
  try {
    const theUser:any = request.headers["user"];
    const userId = theUser.id;
    if (!userId) {
      return response.status(401).json({
        msg: "Invalid User Request",
      });
    }
    const mongoUserId = new mongoose.Types.ObjectId(userId);
    let userObj: any = await UserCollection.findById(mongoUserId);
    if(!userObj){
        return ThrowError(response,404,"User is not found");
      }
      return userObj;
  } catch (error) {
    return ThrowError( response);
  }
};
