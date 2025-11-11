import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import Authentication_token from '../../middlewares/Authentication_middeware.js';

dotenv.config();

const Bot_Router = express.Router();
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME || 'gemini-2.5-pro';
const FALLBACK_MODEL_NAME = 'gemini-1.5-pro';

const GENERATION_CONFIG = {
    temperature: 0.7,
    topK: 1,
    topP: 0.95,
    maxOutputTokens: 1000// reduced to avoid overload
};
const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);
let primaryModel = genAI.getGenerativeModel({ model: MODEL_NAME });
let fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL_NAME });

// Safe generation function with retry & fallback
async function safeGenerate(prompt) {
    let currentModel = primaryModel;

    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            const chat = currentModel.startChat({
                generationConfig: GENERATION_CONFIG,
                safetySettings: SAFETY_SETTINGS,
                history: [],
            });

            const result = await chat.sendMessage(prompt);
            if (result.error) throw new Error(result.error.message);
            return result.response.text();

        } catch (err) {
            if (err.status === 503) {
                // Model overloaded, retry with exponential backoff
                console.log(`Model overloaded (503), retry attempt ${attempt}...`);
                await new Promise(res => setTimeout(res, attempt * 2000));

            } else if (err.status === 404) {
                // Invalid model, switch to fallback
                if (currentModel !== fallbackModel) {
                    console.warn(`Primary model invalid, switching to fallback model: ${FALLBACK_MODEL_NAME}`);
                    currentModel = fallbackModel;
                } else {
                    throw new Error('Both primary and fallback models are invalid.');
                }

            } else {
                // Other errors
                throw err;
            }
        }
    }

    throw new Error('Failed after multiple retries due to model overload.');
}

// /content route
Bot_Router.post("/content", Authentication_token, async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim().length === 0) {
            return res.status(400).json({ message: "Invalid question" });
        }

        const prompt = `You are a notes optimization AI. Optimize the given text clearly and give the result in a simpler way with at least 10 lines and a title. Avoid special characters: ${question}`;

        const aiOutput = await safeGenerate(prompt);

        if(!aiOutput || aiOutput.trim().length === 0){
            return res.status(500).json({
                message: "AI returned empty response"
            });
        }

        console.log("AI Output:", aiOutput.response.text());

        return res.status(200).json({
            message: "Output fetched successfully",
            data: aiOutput.response.text(),
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message || err,
        });
    }
});

export default Bot_Router;
