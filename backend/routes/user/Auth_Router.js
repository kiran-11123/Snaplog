import express from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
const Auth_Router = express.Router();
import transporter from './Mail.js';


Auth_Router.post("/signup" , async(req,res)=>{
       
    try{

        const {email , username  , Password} = req.body;

        const find_email = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(find_email){
            return res.status(400).json({
                message:"Email Already Registered, Please Login ..."
            })
        }

        const username_check = await prisma.user.findUnique({
            where:{
                username : username
            }
        })

        if(username_check){
             return res.status(400).json({
                message : "Username already exists "
             })
        }

        const hashed_password = await bcrypt.hash(Password , 10);


       await prisma.user.create({
            data:{
                email,
                username,
                password : hashed_password
            }
        })

       

        return res.status(201).json({
            message:"User Registered Successfully...",
           
        })


    }
    catch(er){
        return res.status(500).json({
            message:"Internal Server Error...",
            error:er
        })
    }
})


Auth_Router.post("/signin" , async(req,res)=>{
      
    try{

        const {email , Password } = req.body;

      

        const email_check = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!email_check){
            return res.status(400).json({
                message:"Email not found , Please Register"
            })
        }

        const password_check = await bcrypt.compare(Password , email_check.password);
        
        if(!password_check) {
             return res.status(400).json({
                message:"Password is Wrong"
            })
        }

         const details  = {"email":email , "username":email_check.username }


        
        const token = jwt.sign(details , process.env.JWT_SECRET , {expiresIn:"1h"})

      

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 3600000
        });
        
        console.log("before")

        return res.status(200).json({
            message:"Login Successfull..",
            token:token
        })

    }
    catch(er){
         return res.status(500).json({
            message:"Internal Server Error..",
            error:er
         })
    }
})









Auth_Router.post("/resetpassword" , async(req,res)=>{
      

    try{

        const email = req.body.email;

        const find_email = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!find_email){
             return res.status(400).json({
                message:"Email not found..."
             })
        }

        let code = Math.floor(Math.random()*100000 + 100000);

        console.log(code);

        let mailoptions = {

            from :"eventnest.official.main@gmail.com",
            to:email,
            subject : "Password Reset Code ",
            text : "Please find the code to reset the password.",
            html :`
               
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; max-width: 600px; margin: auto; background-color: #f9f9f9"> 
                 
            <h1 style="color: #4CAF50; text-align: center;" > Enter this code to reset the password </h1>

              <p style="margin-top :10px  text-align: center; font-size: 16px;  color: #555;">${code}</p>
            </div>

            `
        }

        await transporter.sendMail(mailoptions);

        return res.status(200).json({
          

          message:"Email verified Successfully " ,
          code :"token"
        
        
        }
        
        )

    }
    catch(er){

        console.log(er)
        return res.status(500).json({
            message:"Internal Server Error",
            error:er
        })
    }
})










export default Auth_Router