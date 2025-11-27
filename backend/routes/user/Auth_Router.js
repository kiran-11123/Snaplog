import express from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
const Auth_Router = express.Router();
import transporter from './Mail.js';
import logger from '../../utils/logger.js'; 


Auth_Router.post("/signup" , async(req,res)=>{

   logger.info(`POST /signup`);
       
    try{

        const {email , username  , Password} = req.body;

        const find_email = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(find_email){
             logger.warn(`Signup failed: Email already exists (${email})`);
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
            logger.warn(`Signup failed: Username already exists (${username})`);
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

       
        
         logger.info(`User registered successfully (${email})`);
        return res.status(201).json({
            message:"User Registered Successfully...",
           
        })


    }
    catch(er){
         logger.error(`Signup Error: ${er.message}`);
        return res.status(500).json({
            message:"Internal Server Error...",
            error:er
        })
    }
})


Auth_Router.post("/signin" , async(req,res)=>{
     logger.info(`POST /signin`);

      
    try{

        const {email , Password } = req.body;

      

        const email_check = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!email_check){
             logger.warn(`Login failed: Email not found (${email})`);
            return res.status(400).json({
                message:"Email not found , Please Register"
            })
        }

        const password_check = await bcrypt.compare(Password , email_check.password);
        
        if(!password_check) {
            logger.warn(`Login failed: Incorrect password (${email})`);
             return res.status(400).json({
                message:"Password is Wrong"
            })
        }

    

         const details  = {"user_id" : email_check.userId , "email":email , "username":email_check.username }


        
        const token = jwt.sign(details , process.env.JWT_SECRET , {expiresIn:"1h"})

      

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
           
        });
        
        
        logger.info(`Login successful (${email})`);
        return res.status(200).json({
            message:"Login Successfull..",
            token:token
        })

    }
    catch(er){
         logger.error(`Signin Error: ${er.message}`);
         return res.status(500).json({
            message:"Internal Server Error..",
            error:er
         })
    }
})









Auth_Router.post("/resetpassword" , async(req,res)=>{
       logger.info(`POST /resetpassword`);
      

    try{

        const email = req.body.email;

        const find_email = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!find_email){
          logger.warn(`Reset failed: Email not found (${email})`);
             return res.status(400).json({
                message:"Email not found..."
             })
        }

        let code = Math.floor(Math.random()*900000 + 100000);

       const expiry = new Date( Date.now() +15*60*1000) //15 minutes

        await prisma.user.update({
            where:{email},
            data:{
                resetCode : code.toString(),
                resetCodeExpires : expiry,
            }
        })


        let mailoptions = {

            from :"eventnest.official.main@gmail.com",
            to:email,
            subject : "Password Reset Code ",
            text : "Please find the code to reset the password.",
            html :`
               
           <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
      
      <h1 style="color: #4CAF50; text-align: center;margin-bottom:20px;">
        Enter this code to reset your password
      </h1>

      <div style="text-align:center;">
        <div style="
          display: inline-block;
          padding: 12px 25px;
          background-color: #ffffff;
          border: 2px dashed #4CAF50;
          border-radius: 8px;
          font-size: 22px;
          letter-spacing: 4px;
          font-weight: bold;
          color: #333;">
          ${code}
        </div>
      </div>

      <p style="color:#555; text-align:center; margin-top:25px; font-size: 14px;">
        If you did not request this, you can safely ignore this email.
      </p>

    </div>
            `
        }

        await transporter.sendMail(mailoptions);

        logger.info(`Reset code sent to (${email})`);
        return res.status(200).json({
          

          message:"verification code sent to your Email.. " ,
          Passcode:code
         
        
        
        }
        
        )


    }
    catch(er){
            logger.error(`Reset Password Error: ${er.message}`);
      

        return res.status(500).json({
            message:"Internal Server Error",
            error:er
        })
    }
})



Auth_Router.post("/verify-code" , async(req,res)=>{

      logger.info(`POST /verify-code`);
      
    try{

        const email = req.body.email;
        const code = req.body.code;

        const user = await prisma.user.findUnique({
             where:{
                email
             }
        })

        if(!user){
            logger.warn(`Code verification failed: Email incorrect (${email})`);
            return res.status(400).json({
                message : "Email is wrong."
            })
        }

        if(user.resetCodeExpires < Date.now()){
             logger.warn(`Code expired for (${email})`);
             return res.status(400).json({
                message : "Code is Expired.."
             })
        }

      
         if (user.resetCode !== code) {
            logger.warn(`Incorrect OTP attempt for (${email})`);
            return res.status(400).json({ message: "Incorrect Code" });
        }

        logger.info(`Code verified successfully (${email})`);


        return res.status(200).json({
            message : "Code verified Successfully..."
        })

    }
    catch(er){
        logger.error(`Verify Code Error: ${er.message}`);
        return res.status(500).json({
            message:"Internal Server Error..",
            error:er
        })
    }
})




Auth_Router.put("/resetPassword" , async(req,res)=>{

          logger.info(`PUT /resetPassword`);

        
    try{



        const password = req.body.Password;
        const email = req.body.email;


        const user = await prisma.user.findUnique({
             where:{
                email
             }
        })

        if(!user){
            logger.warn(`Password reset failed: Email incorrect (${email})`);
             return res.status(400).json({
                message:"Email is wrong.."
             })
        }


        const hashed_password = await bcrypt.hash(password , 10);

        await prisma.user.update({
            where:{email},
            data:{password : hashed_password}
        })

       logger.info(`Password reset successful (${email})`);

        return res.status(200).json({
            message:"Password reset Successfull.."
        })
         

    }
    catch(er){

        logger.error(`Reset Password Update Error: ${er.message}`);
         
        return res.status(500).json({
            message:"Internal Server Error.",
            error:er
        })
    }
})









export default Auth_Router