import express from 'express';
const app = express();
import dotenv from 'dotenv'
dotenv.config();
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser';
const port  = process.env.PORT;
import Auth_Router from './routes/user/Auth_Router.js';
import cors from 'cors'
import data_Router from './routes/data/Data_Router.js';

const limiter = rateLimit({
    windowMs :15*60*1000,
    max:1000,
    message:"Too Many requests , Please try again later" 
})


app.use(express.json());
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))
app.use(cookieParser());

app.use("/api/v1/user/" , Auth_Router);
app.use("/api/v1/data" , data_Router)





app.listen(port || 5000 , ()=>{
    console.log("Server is Running")
})