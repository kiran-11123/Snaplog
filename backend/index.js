import express from 'express';
const app = express();
import dotenv from 'dotenv'
dotenv.config();
const port  = process.env.PORT;











app.listen(port || 5000 , ()=>{
    console.log("Server is Running")
})