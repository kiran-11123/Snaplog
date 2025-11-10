import express   from 'express'
import dotenv from 'dotenv';
import {GoogleGenerativeAI ,HarmCategory , HarmBlockThreshold } from '@google/generative-ai'
import Authentication_token from '../../middlewares/Authentication_middeware.js';
dotenv.config();
const Bot_Router = express.Router();
const API_KEY = process.env.GEMINI_API_KEY 
const model1  = process.env.MODEL_NAME



const GENERATION_CONFIG = {
    temperature :0.9,
    topK:1,
    topP:1,
    maxOutputTokens : 4096
}

const SAFETY_SETTINGS   =[
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];


Bot_Router.post("/content" , Authentication_token , async(req,res)=> {

    try{

        const question = req.body.question;


        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({model : model1});


        const chat =model.startChat({
            generationConfig:GENERATION_CONFIG,
            safetySettings:SAFETY_SETTINGS,
            history:[]
        })


        if(!question || question.length===0){
              
            return res.status(400).json({
                message:"Invalid Question..",
               
            })
        }

        const prompt = `You are a notes optimization AI. optimize the given text clearly and give the result in a simpler way and i dont want any special characters in the result ${question}`

        const result =await chat.sendMessage(prompt);

        if(result.error){
            return res.status(400).json({
                message:result.error.message
            })
        }
        

        return res.status(201).json({
            message:"Output Fetched successfully..",
            data : result.response.text(),
             all_data:result.response
        })
    }
    catch(er){
        console.log(er);
        return res.status(500).json({
            message:"Internal Server Error",
            error:er
        })
    }
    
})

























export default Bot_Router;