import cron from 'node-cron';
import redis_client from '../routes/redis/redis-client.js';
import logger from './logger.js';
import fs from 'fs'


cron.schedule('0 0 * * *', async () => {

    try{

        await redis_client.flushAll();
        logger.info("Cron Job: Cleared all Redis cache for favourites data");

    }
    catch(err){
        logger.error("Error in cron job for clearing redis favourites: " + err.message);
    }


})



cron.schedule("0 0 * * * *", async () => {


    try{

        logger.info("Cron Job: Log maintenance started");

        // Here you can add code to archive or delete old logs if you have a log management system

        fs.unlink("logs/app.log", (err) => {
  if (err) {
    console.error("Error deleting log file:", err);
  } else {
    console.log("Log file deleted successfully!");
  }
});

        logger.info("Cron Job: Log maintenance completed");

    }
    catch(err){
        logger.error("Error in cron job for Log maintenance: " + err.message);
    }





})