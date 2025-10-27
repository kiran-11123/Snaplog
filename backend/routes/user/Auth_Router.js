import express from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs'
const Auth_Router = express.Router();



Auth_Router.post("/signup" , async(req,res)=>{
       
    try{

        const {email , username  , password} = req.body;

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

        const hashed_password = await bcrypt.hash(password , 10);


        prisma.user.create({
            data:{
                email,
                username,
                hashed_password
            }
        })
        

        return res.status(201).json({
            message:"User Registered Successfully..."
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

        const {email , password } = req.body;

        const email_check = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!email){
            return res.status(400).json({
                message:"Email not found , Please Register"
            })
        }

        const password_check = await bcrypt.compare(password , email_check.password);

        if(!password_check) {
             return res.status(400).json({
                message:"Password is Wrong"
            })
        }


        return res.status(200).json({
            message:"Login Successfull.."
        })

    }
    catch(er){
         return res.status(500).json({
            message:"Internal Server Error..",
            error:er
         })
    }
})










export default Auth_Router