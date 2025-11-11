import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Authentication_token from "../../middlewares/Authentication_middeware.js";

dotenv.config();
const Bot_Router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME || "gemini-1.5-flash-latest";

// Reusable AI instance
const genAI = new GoogleGenerativeAI(API_KEY);

const GENERATION_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 4096
};

// Retry wrapper for overloaded model (503)
async function safeGenerate(model, prompt, retries = 3) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    if (err.status === 503 && retries > 0) {
      console.log("⚠️ Model overloaded, retrying...");
      await new Promise(resolve => setTimeout(resolve, 1200));
      return safeGenerate(model, prompt, retries - 1);
    }
    throw err;
  }
}

Bot_Router.post("/content", Authentication_token, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: "Invalid question." });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
You are an AI that rewrites notes clearly.
Rewrite the text in *simple language*. 
Output:
- A clear title
- A clean structure
- At least 10 lines
- No special characters like * # ( ) @ $ % & etc.
Text:
${question}
`;

    const responseText = await safeGenerate(model, prompt);

    return res.json({
      success: true,
      message: "Output generated successfully.",
      data: responseText
    });

  } catch (error) {
    console.error("❌ AI Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI service unavailable. Try again later.",
      error: error?.message || error
    });
  }
});

export default Bot_Router;
