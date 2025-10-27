import express from 'express'
import dotenv from 'dotenv'
const app = express();
dotenv.config()

const port = process.env.PORT;








app.listen(port || 5000 , ()=>{
    console.log("Server is Running.....")
})