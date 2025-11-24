import express from 'express'
const Favourites_router = express.Router();
import Authentication_token from '../../middlewares/Authentication_middeware.js';
import logger from '../../utils/logger.js';
import workspace_model from '../../DB/workspace.js';

Favourites_router.post("/get_favourties" , Authentication_token , async(req,res)=>{
           
    try{

        logger.info("Request: POST /get_favourties")

        const user_id = req.user.user_id;

        const get_data = await workspace_model.findOne({userid : user_id});
   
        if(!get_data){

            logger.warn("User not found while fetching the favourites")
            return res.status(400).json({
                message:"User Not Found.."
            })
        }

        const data = get_data.Favourites || [];

        if(data.length===0){
            logger.info("No favourites present for the user while fetching the favourites")
            return res.status(201).json({
                message : "No Favourites Present.."
            })
        }
            logger.info(`Favourites fetched successfully for the userid ${user_id}`);

        return res.status(201).json({
            message:"Favourites found successfully...",
            favourites : data,
        })

    }
    catch(er){
        logger.info("Server Error while fetching the favourites" , er);

        return res.status(500).json({
            message:"Internal Server Error...",
            error:er
        })
    }
})




















export default Favourites_router;