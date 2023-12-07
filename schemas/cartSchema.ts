import mongoose from "mongoose";
import { ICart } from "../models/ICart";


const CartSchema = new mongoose.Schema<ICart>({
products: [{
    product:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"products"},
    count:{type:Number,required:true},
    price:{type:Number,required:true}
}],
total:{type:String,required:true},
tax:{type:String,required:true},
grandTotal:{type:String,required:true},
userObj: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users" }
},{timestamps:true});
const CartCollection = mongoose.model<ICart>("carts",CartSchema);
export default CartCollection;