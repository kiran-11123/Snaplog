import express from 'express'
const data_Router = express.Router();
import Authentication_token from '../../middlewares/Authentication_middeware.js';
import data_model from '../../DB/data.js';
import mongoose from 'mongoose';
import transporter from '../user/Mail.js';
import logger from '../../utils/logger.js';
import { producer ,setupKafka , TOPIC  } from '../kafka/producer.js';
import workspace_model from '../../DB/workspace.js';
import redis_client from '../redis/redis-client.js';
import Favourites_model from '../../DB/data.js';

data_Router.post("/upload_data", Authentication_token, async (req, res) => {

    try {

        logger.info("Request: POST /upload_data");

        const data_received = req.body.data;
        const title = req.body.title;
        let workspace = req.body.workspace;

       

        if (!data_received || data_received.length === 0) {
             logger.warn("Upload attempt with empty data");
            return res.status(403).json({
                message: "Data Not found to store"
            })
        }


        const user_id = req.user.user_id;

       let check_workspace = await workspace_model.findOne({workspace_name : workspace})
       console.log(check_workspace)

        if (!check_workspace) {

          
                check_workspace = new workspace_model({
                workspace_name : workspace,
                userid: user_id,
                notes : []
            })

             check_workspace.notes.push({
                title,
                data: data_received
            });
           
        }

        else {
            
            console.log("inside the else")
            check_workspace.notes.push({
                title,
                data: data_received
            });
        }
 

        await check_workspace.save();

        logger.info(`Data saved for user: ${user_id}`);


       const message = {
            user_id ,
            title,
            data:data_received,
            timestamp : Date.now()
        }

        await producer.send({
            topic: TOPIC,
            messages: [
                { key: message.user_id, value: JSON.stringify(message) }
            ]
        }).catch(err => console.error('Kafka error:', err));
       logger.info(`Message sent to Kafka for user: ${user_id}`); 

        return res.status(200).json({
            messsage: "Data Saved Successfully..."
        })







    }
    catch (er) {

      logger.error("Error in /upload_data: " + er.message);

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})





data_Router.post("/workspace_get_data", Authentication_token, async (req, res) => {
    try {

          logger.info("Request: POST /workspace_get_data");

        
        const user_id = req.user.user_id;
        let workspace = req.body.workspace_name;

         const user = await workspace_model.findOne({ workspace_name: workspace }); 
        const count = user.recentlyDeleted.length;
      
        try{

        
        const cachedData = await redis_client.get(`workspace:${workspace}`);

        if(cachedData){
              
          if(cachedData.length===0){
                 logger.info(`No notes found for user: ${user_id} in redis cache`);
                 return res.status(200).json({
                  message: "Your Notes are Empty.",
                  data: [],
                  count:count
                 })
          }
          else{
              
             logger.info("Notes Data found for the workspace in redis cache.")
             console.log(JSON.parse(cachedData));
             return res.status(200).json({
                message: "Data Fetched Successfully.",
                data:cachedData ? JSON.parse(cachedData) : [],
                workspace_name : workspace,
                count: count 
             })
          }
        }  
      }
      catch(er){
          logger.error("Error while fetching data from redis: " + er.message);
      }
        


       

        if (user.notes.length === 0) {
              logger.info(`No notes found for user: ${user_id}`);
            return res.status(200).json({
                message: "Your Notes are Empty.",
                data: [],
                count:count
            });
        }

         logger.info(`Fetched ${user.notes.length} notes for user: ${user_id} and also stored in redis `);
        
      try {
            await redis_client.setEx(`workspace:${workspace}`, 120, JSON.stringify(user.notes));
            await redis_client.setEx('count' , 120 , JSON.stringify(count) )
            logger.info(`Fetched ${user.notes.length} notes for user: ${user_id} and stored in redis`);
        } catch (redisErr) {
            logger.warn("Redis storage error: " + redisErr.message);
        }   
        
        console.log("user notes is " , user.notes);
        return res.status(200).json({
            message: "Data Fetched Successfully.",
            data: user.notes,
            workspace_name : user.workspace_name,
            count:count
        });
    } catch (er) {
 logger.error("Error in /get_data: " + er.message);
         return res.status(500).json({
            message: "Internal Server Error",
            error: er
        });
    }
});




data_Router.post("/share", Authentication_token, async (req, res) => {

    try {

         logger.info("Request: POST /share");

        const username = req.user.username;
        const email = req.body.email;
        const data = req.body.data;

        let mailoptions = {
            from: "eventnest.official.main@gmail.com",
            to: email,
            subject: `Notes Content Shared By ${username}`,
            text: "",
            html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; max-width: 600px; margin: auto; background-color: #f9f9f9;">

      <h1 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">
        Notes Shared By ${username}
      </h1>

      <p style="font-size: 15px; color:#444; text-align:center; margin-bottom: 15px;">
        Here is the note content:
      </p>

      <div style="
        white-space: pre-wrap;
        padding: 15px;
        background-color: #ffffff;
        border-left: 5px solid #4CAF50;
        border-radius: 6px;
        font-size: 16px;
        line-height: 1.6;
        color: #111;
      ">
        ${data}
      </div>

      <p style="color:#666; font-size: 14px; text-align:center; margin-top: 25px;">
        Sent via EventNest Notes Sharing System.
      </p>

    </div>
  `
        };

        await transporter.sendMail(mailoptions);

           logger.info(`Mail sent to ${email} by ${username}`);


        return res.status(200).json({


            message: "Data sent successfully..",




        })


    }
    catch (er) {

         logger.error("Error in /share: " + er.message);

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})
data_Router.post("/favourites", Authentication_token, async (req, res) => {
  try {
    logger.info("Request: POST /favourites");

    const objId = req.body.contentId;
    const workspace_name = req.body.workspace_name;

    if (!objId || !workspace_name) {
      return res.status(400).json({
        message: "Missing contentId or workspace_name",
      });
    }

    const user_id = req.user?.user_id || req.user?.userid;
    
    if (!mongoose.Types.ObjectId.isValid(objId)) {
      return res.status(400).json({ message: "Invalid contentId" });
    }
    const objIdObj = new mongoose.Types.ObjectId(objId);

    // Find the workspace
    const workspace = await workspace_model.findOne({
      workspace_name: workspace_name,
    });

    if (!workspace) {
      logger.warn("Workspace not found...");
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // Find the note to toggle favourite
    const note = workspace.notes.id(objIdObj);
    if (!note) {
      logger.warn("Note not found in workspace");
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Toggle favourite
    note.favourite = !note.favourite;
    await workspace.save();

    logger.info(`Note favourite toggled to ${note.favourite} for user ${user_id}`);

    // Manage favourites collection
    if (note.favourite) {
      // Add to favourites
      let favouritesDoc = await Favourites_model.findOne({ user_id: user_id });

      if (!favouritesDoc) {
        favouritesDoc = new Favourites_model({
          user_id: user_id,
          Favourites: []
        });
      }

      // Check if already in favourites
      const exists = favouritesDoc.Favourites.some(fav => fav._id.toString() === objIdObj.toString());
      
      if (!exists) {
        favouritesDoc.Favourites.push({
          _id: objIdObj,
          title: note.title,
          data: note.data,
          workspace_name: workspace_name,
          favourite: true
        });
        await favouritesDoc.save();
        logger.info(`Note added to favourites for user ${user_id}`);
      }
    } else {
      // Remove from favourites
      const favouritesDoc = await Favourites_model.findOne({ user_id: user_id });
      
      if (favouritesDoc) {
        favouritesDoc.Favourites = favouritesDoc.Favourites.filter(
          fav => fav._id.toString() !== objIdObj.toString()
        );
        await favouritesDoc.save();
        logger.info(`Note removed from favourites for user ${user_id}`);
      }
    }

    // Invalidate Redis caches
    try {
      await redis_client.del(`favourites_${user_id}`);
      await redis_client.del(`workspace:${workspace_name}`);
      logger.info("Redis caches invalidated for user and workspace");
    } catch (redisErr) {
      logger.warn("Redis invalidation error: " + redisErr.message);
    }

    return res.status(200).json({
      message: "Favourite status updated successfully",
      favourite: note.favourite,
    });

  } catch (er) {
    logger.error("Error in /favourites: " + er.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: er.message
    });
  }
});
// ...existing code...


data_Router.delete("/restore", Authentication_token, async (req, res) => {

  try {
    logger.info("Request: Restore /restore");

    let objId = req.body.contentId;
    const workspace_name = req.body.workspace_name;

    if (!objId || !workspace_name) {
      return res.status(400).json({
        message: "Missing contentId or workspace_name",
      });
    }

    const user_id = req.user.userid; 
    const objIdObj = new mongoose.Types.ObjectId(objId);

    // Find and update workspace

    const find_workspace = await workspace_model.findOne({workspace_name : workspace_name})

    if(!find_workspace){
       logger.warn("WorkSpace not found..")
       return res.status(400).json({
        message:"WorkSpace not found"
       })
    }



    const find_DataById = find_workspace.recentlyDeleted.id( objIdObj);
    
    console.log(find_DataById)

    if(!find_DataById){
       
      logger.warn("Note not found...") 
      return res.status(404).json({
        message:"Note not found"
       })
    }

    find_workspace.notes.push({
         title:find_DataById.title,
         data : find_DataById.data,
         deletedAt : new Date()
    })
    

    find_DataById.deleteOne();
    await find_workspace.save();
    logger.info(`Note moved to Notes for user ${user_id}`);
     
    const cachedData = await redis_client.get(`workspace:${workspace_name}`);

    if(cachedData){ 

        try {
            await redis_client.del(`workspace:${workspace_name}`);
            logger.info("Redis cache invalidated for workspace: " + workspace_name);
        } catch (redisErr) {
            logger.warn("Redis invalidation error: " + redisErr.message);

    }
  }
    return res.status(200).json({
      message: "Note moved to Notes",
    });


  } catch (er) {
    logger.error("Error in /restore: " + er.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});





export default data_Router;