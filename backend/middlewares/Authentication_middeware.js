import express from 'express'
import jwt, { decode } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();


const Authentication_token = (req,res,next)=>{

    const token = req.cookies?.token;


    if(!token){
        return res.status(401).json({
            message:"Unauthorized : Token Not found.."
        })
    }


    try{

        const decoded  = jwt.verify(token , process.env.JWT_SECRET);


        if(!decoded){
             return res.status(401).json({
                message:"Invalid Token payload."
             })
        }

       
        req.user = decoded;
        next();


    }
    catch(er){
         
        return res.status(401).json({
            message:"Invalid Token",
            error:er
        })
    }

}

export default Authentication_token;
