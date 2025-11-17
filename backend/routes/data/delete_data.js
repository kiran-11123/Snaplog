import express from 'express'
const  Delete_Router = express.Router();
import workspace_model from '../../DB/workspace.js';
import Authentication_token from '../../middlewares/Authentication_middeware.js';
import logger from '../../utils/logger.js';
import mongoose from 'mongoose';
import redis_client from '../redis/redis-client.js';


Delete_Router.delete("/delete", Authentication_token, async (req, res) => {
  try {
    logger.info("Request: DELETE /delete");

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


    console.log(find_workspace);

    const find_DataById = find_workspace.notes.id( objIdObj);

    console.log(find_DataById)

    if(!find_DataById){
       
      logger.warn("Note not found...") 
      return res.status(404).json({
        message:"Note not found"
       })
    }

    find_workspace.recentlyDeleted.push({
         title:find_DataById.title,
         data : find_DataById.data,
         favourite : false,
         deletedAt : new Date()
    })
    

    find_DataById.deleteOne();
    await find_workspace.save();
    logger.info(`Note moved to recently deleted for user ${user_id}`);

      try {
            await redis_client.del(`workspace:${workspace_name}`);
            logger.info("Redis cache invalidated for workspace: " + workspace_name);
        } catch (redisErr) {
            logger.warn("Redis invalidation error: " + redisErr.message);
        }   
 
    return res.status(200).json({
      message: "Note moved to recently deleted",
    });


  } catch (er) {
    logger.error("Error in /delete: " + er.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});





Delete_Router.post("/recently_deleted" , Authentication_token , async(req,res)=>{
        
  try{

    logger.info("Request: POST /recently_deleted");
     
    const user_id = req.user.userid;

    const workspace_name = req.body.workspace_name;

   
    
    const find_workspace =  await workspace_model.findOne({workspace_name : workspace_name})

    if(!find_workspace){
      return res.status(400).json({
        message:"Work Space is not there..."
      })
    }

   /*  const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 10); // 10 days ago

      const beforeCount = find_workspace.recentlyDeleted.length;

      find_workspace.recentlyDeleted = find_workspace.recentlyDeleted.filter(note => {
          return note.deletedAt >= cutoffDate;
      });

      const afterCount = find_workspace.recentlyDeleted.length;

      if (beforeCount !== afterCount) {
          logger.info(`Cleaned up ${beforeCount - afterCount} old notes from recently deleted for user: ${user_id}`);
      }  */


     if (find_workspace.recentlyDeleted.length === 0) {
              logger.info(`No Recent deletions found for user: ${user_id}`);
            return res.status(200).json({
                message: "Your Bin is Empty.",
                data: []
            });
        }

     

      await find_workspace.save();

         logger.info(`Fetched ${find_workspace.recentlyDeleted.length} notes for user: ${user_id}`);

        return res.status(200).json({
            message: "Data Fetched Successfully.",
            data: find_workspace.recentlyDeleted,
           
        })



  }
  catch(er){
       
    logger.warn("Error in Recenlty Deleted : " + er.message )
     return res.status(500).json({
      message: "Internal Server Error",
    });
  }
})


Delete_Router.delete("/permanent_delete", Authentication_token, async (req, res) => { 


  try{

    logger.info("Request: delete /permanent_delete")

    
    let objId = req.body.contentId;
    const workspace_name = req.body.workspace_name;

    if (!objId || !workspace_name) {
      return res.status(400).json({
        message: "Missing contentId or workspace_name",
      });
    }

    const user_id = req.user.userid; 
    const objIdObj = new mongoose.Types.ObjectId(objId);


    const find_workspace = await workspace_model.findOne({workspace_name:workspace_name});


    if(!find_workspace){
       logger.warn("Workspace is not present...")
       return res.status(404).json({
        message:"Workspace is not present..."
       })
    }


    find_workspace.recentlyDeleted.pull({_id : objIdObj});

    await find_workspace.save();


    logger.info("Notes Deleted Permanently for userid  " ,user_id)

    return res.status(200).json({
      message:"Notes deleted permanently.."
    })

  }
  catch(er){
      logger.warn("Error in /permanent_delete function " ,er)
      return res.status(500).json({
        message:"Internal Server Error"
      })
  }




})













export default Delete_Router;