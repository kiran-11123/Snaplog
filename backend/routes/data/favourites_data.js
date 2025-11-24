import express from 'express'
const Favourites_router = express.Router();
import Authentication_token from '../../middlewares/Authentication_middeware.js';
import logger from '../../utils/logger.js';
import workspace_model from '../../DB/workspace.js';
import redis_client from '../redis/redis-client.js';
import Favourites_model from '../../DB/data.js';

Favourites_router.post("/get_favourites", Authentication_token, async (req, res) => {
    try {
        logger.info("Request: POST /get_favourites");
        const user_id = req.user.user_id;

        if (!user_id) {
            logger.warn("User ID not found in token");
            return res.status(401).json({
                message: "Unauthorized - User ID missing"
            });
        }

        // Check Redis cache first
        try {
            const cachedData = await redis_client.get(`favourites_${user_id}`);
            if (cachedData) {
                logger.info(`Favourites fetched from cache for userid ${user_id}`);
                return res.status(200).json({
                    message: "Favourites found successfully (from cache)...",
                    favourites: JSON.parse(cachedData),
                });
            }
        } catch (redisErr) {
            logger.warn("Redis cache error: " + redisErr.message);
        }

        // Fetch from database
        const user = await Favourites_model.findOne({ user_id: user_id });

        if (!user) {
            logger.warn(`User not found while fetching the favourites for userid ${user_id}`);
            return res.status(200).json({
                message: "No Favourites Present..",
                favourites: []
            });
        }

        const favouritesList = user.Favourites || [];

        if (favouritesList.length === 0) {
            logger.info(`No favourites present for user ${user_id}`);
            return res.status(201).json({
                message: "No Favourites Present..",
                favourites: []
            });
        }

        // Store in Redis for future requests
        try {
            await redis_client.setEx(`favourites_${user_id}`, 3600, JSON.stringify(favouritesList));
            logger.info(`Favourites cached for userid ${user_id}`);
        } catch (redisErr) {
            logger.warn("Redis storage error: " + redisErr.message);
        }

        logger.info(`Favourites fetched successfully for userid ${user_id}`);
        return res.status(201).json({
            message: "Favourites found successfully...",
            favourites: favouritesList,
        });

    } catch (er) {
        logger.error("Server Error while fetching the favourites: " + er.message);
        return res.status(500).json({
            message: "Internal Server Error...",
            error: er.message
        });
    }
});

export default Favourites_router;