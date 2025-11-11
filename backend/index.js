import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
const port  = process.env.PORT || 5000;
import Auth_Router from './routes/user/Auth_Router.js';
import cors from 'cors';
import data_Router from './routes/data/Data_Router.js';
import connectDB from './DB/mongodb.js';
import Bot_Router from './routes/ai/bot.js';
import logger from "./utils/logger.js";

await connectDB()
  

const limiter = rateLimit({
  windowMs :15*60*1000,
  max:1000,
  message:"Too Many requests , Please try again later" 
});

app.use(express.json());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(cors({
  origin:'http://localhost:3000',
  credentials:true
}));
app.use(cookieParser());
app.use(limiter);

// Routes
app.use("/api/v1/users/", Auth_Router);
app.use("/api/v1/data", data_Router);
app.use("/api/v1/ai", Bot_Router);

// Global Error Logger
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
app.listen(port, () => {
  logger.info(`🚀 Server is running on port ${port}`);
});
