import  { Request, Response, NextFunction } from "express";
import {validationResult} from "express-validator"
import { APP_CONSTANTS } from "../constants";

export const validateForm =async(request:Request,response:Response,next:NextFunction)=>{
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({
            msg:errors.array().map(error=>error.msg).join("\n"),
            data:null,
            statusbar:APP_CONSTANTS.FAILED
        })
    }
    next();
}