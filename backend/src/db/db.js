
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async()=>{
        try{
            // console.log(process.env.MONGODB_URI);
            
            const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
           console.log("Database Connected Successfully : " + connectionInstance.connection.host);
        }catch(error){
            console.error("Database connection Failed : " + error);
            console.log(process);
            
            process.exit(1);
            
        }
}

export default connectDB;