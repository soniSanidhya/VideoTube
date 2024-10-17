import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/db.js';
import {app} from './app.js';
// const app = express();
dotenv.config({
    path : './.env'
})

connectDB().then(()=>{
        app.listen(process.env.PORT || 8000 , ()=>{
            console.log("Server is listning on Port : ",process.env.PORT || 8000);
                
        })
})