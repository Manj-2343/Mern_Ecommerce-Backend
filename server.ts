import express,{Application,Request,Response} from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { DBUtils } from './db/dbUtils';
import addressRouter from './routers/address/addressRouter';
import categoryRouter from './routers/categories/categoriesRouter';
import orderRouter from './routers/orders/ordersRouter';
import productRouter from './routers/products/productsRouter';
import userRouter from './routers/users/usersRouter';
import cartRouter from './routers/cart/cartRouter';

// to initialize the express server
const app:express.Application = express();

//configure express to receive the form data
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

//configure the dot-env
dotenv.config({
    path:"./.env",
})


const port :string| number = process.env.PORT || 9999;
const dbUrl:string|undefined = process.env.EXPRESS_APP_MONGO_DB_CLOUD_URL;
const dbName:string|undefined = process.env.EXPRESS_APP_MONGO_DB_DATABASE_NAME;

app.get("/",(request:express.Request,response:express.Response)=>{
    response.status(200);     
    response.json({
        msg:"welcome to express server"
    });
});
//configure the Router

app.use("/api/users",userRouter);
app.use("/api/categories",categoryRouter);
app.use("/api/products",productRouter);
app.use("/api/address",addressRouter);
app.use("/api/carts",cartRouter);
app.use("/api/orders",orderRouter);

if(port){
    app.listen(Number(port),()=>{
        //connect to the database
        if(dbUrl && dbName){
            DBUtils.connectToDB(dbUrl,dbName).then((dbResponse:string)=>{
              console.log(dbResponse);
            }).catch((error)=>{
                console.log(error);
                process.exit(1);//force to stop the express server
            })
        }
        console.log(`Express Server is Started at ${port}`);
        })
}
