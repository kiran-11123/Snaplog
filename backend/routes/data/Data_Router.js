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
    /*   
        try{

        
        const cachedData = await redis_client.get(`workspace:${workspace}`);

        if(cachedData){
              
          if(cachedData.length===0){
                 logger.info(`No notes found for user: ${user_id} in redis cache`);
                 return res.status(200).json({
                  message: "Your Notes are Empty.",
                  data: []
                 })
          }
          else{
              
             logger.info("Notes Data found for the workspace in redis cache.")
             console.log(JSON.parse(cachedData));
             return res.status(200).json({
                message: "Data Fetched Successfully.",
                data:cachedData ? JSON.parse(cachedData) : [],
                workspace_name : workspace
             })
          }
        }  
      }
      catch(er){
          logger.error("Error while fetching data from redis: " + er.message);
      }
        
*/

        const user = await workspace_model.findOne({ workspace_name: workspace }); 


        if (user.notes.length === 0) {
              logger.info(`No notes found for user: ${user_id}`);
            return res.status(200).json({
                message: "Your Notes are Empty.",
                data: []
            });
        }

         logger.info(`Fetched ${user.notes.length} notes for user: ${user_id} and also stored in redis `);
        
    /*    try {
            await redis_client.setEx(`workspace:${workspace}`, 3600, JSON.stringify(user.notes));
            logger.info(`Fetched ${user.notes.length} notes for user: ${user_id} and stored in redis`);
        } catch (redisErr) {
            logger.warn("Redis storage error: " + redisErr.message);
        }   */
        
        console.log("user notes is " , user.notes);
        return res.status(200).json({
            message: "Data Fetched Successfully.",
            data: user.notes,
            workspace_name : user.workspace_name
        });
    } catch (er) {
 logger.error("Error in /get_data: " + er.message);
         return res.status(500).json({
            message: "Internal Server Error",
            error: er
        });
    }
});


data_Router.delete("/delete", Authentication_token, async (req, res) => {
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

    /*  try {
            await redis_client.del(`workspace:${workspace_name}`);
            logger.info("Redis cache invalidated for workspace: " + workspace_name);
        } catch (redisErr) {
            logger.warn("Redis invalidation error: " + redisErr.message);
        }   */
 
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

    let objId = req.body.contentId;
    const workspace_name = req.body.workspace_name;

    if (!objId || !workspace_name) {
      return res.status(400).json({
        message: "Missing contentId or workspace_name",
      });
    }

    const user_id = req.user.userid;
    const objIdObj = new mongoose.Types.ObjectId(objId);

    // Find the workspace that belongs to this user
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
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Toggle favourite
    note.favourite = !note.favourite;

    await workspace.save();

    logger.info("Favourite status updated successfully");
    return res.status(200).json({
      message: "Favourite status updated successfully",
      favourite: note.favourite,
    });
  } catch (er) {
    logger.error("Error in /favourites: " + er.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});



data_Router.post("/recently_deleted" , Authentication_token , async(req,res)=>{
        
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


data_Router.delete("/permanent_delete", Authentication_token, async (req, res) => { 


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