import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from "../utils/logger.js";
dotenv.config();

const connectDB = async () => {

    try{

        await mongoose.connect(process.env.mongodb_url);

        logger.info("MongoDB connected..")

    }

    catch(er){
         logger.error("Error Occured " , er);
         process.exit(1);
    }

}


export default connectDB;