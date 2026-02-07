import { app } from "./src/app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

(async()=>{
    try 
    {
        await mongoose.connect(`${process.env.DATABASE_URL}/backend_database`)
        app.on('error',(error)=>{
            console.log(`error in express${error}`);
        })
        app.get('/',(req,res)=>{
            res.send('<h1>connection estabilish</h1>')
        })
        app.listen(process.env.PORT || 8000,()=>{
            console.log("connection estabilish")
        })
    } catch (error) {
        console.log(error);
        throw error
    }
})()