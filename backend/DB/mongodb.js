import mongoose from 'mongoose';
import dotenv from 'dotenv';




const connectDB = (async)=>{

    try{

    
    mongoose.connect(process.env.mongodb_url ,{

        useNewUrlParser: true,
           useUnifiedTopology: true,

})

    

console.log("MongoDB connected..")

    }

    catch(er){
         console.log("Error Occured " , er);
         process.exit(1);
    }

}


export default connectDB;