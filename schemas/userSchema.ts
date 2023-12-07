import mongoose from "mongoose";
import { IUser } from "../models/IUser";

const UserSchema = new mongoose.Schema<IUser>({
    username: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    imageUrl: {type:String,required:true},
    isAdmin: {type:Boolean,required:true,default:false},
    isSuperAdmin: {type:Boolean,required:true,default:false},
},{timestamps:true});

const UserCollection = mongoose.model<IUser>("users",UserSchema);
export default UserCollection;