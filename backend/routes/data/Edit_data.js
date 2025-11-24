import express from 'express'
const Edit_Router = express.Router();
import workspace_model from '../../DB/workspace.js';
import Authentication_token from '../../middlewares/Authentication_middeware.js';
import logger from '../../utils/logger.js';
import mongoose from 'mongoose';
Edit_Router.post("/edit_notes" , Authentication_token , async(req,res)=>{
       
    try{

        logger.info("Request: Update /edit_notes")
         const id = req.body.contentId;

         const data_received = req.body.data;
         let workspace = req.body.workspace_name;
const user_id = req.user?.user_id || req.user?.userid;

        

            const objIdObj = new mongoose.Types.ObjectId(id);
        

         if (!data_received || data_received.length === 0) {
                     logger.warn("Upload attempt with empty data");
                    return res.status(403).json({
                        message: "Data Not found to store"
                    })
                
        }


        const find_workspace =await workspace_model.findOne({workspace_name : workspace});

        if(!find_workspace){
             logger.warn("Workspace is not present to edit the notes")

             return res.status(404).json({
                message:"Workspace is not present.."
             })
        }
        

    const note = find_workspace.notes.id(objIdObj);
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Toggle favourite
    note.data = data_received;
    note.createdAt = Date.now();

    await find_workspace.save();

      logger.info(`Notes Edited successfully for the userid ${user_id}`);
    return res.status(200).json({
      message: "Notes Edited successfully",
      favourite: note.favourite,
    });


            

    }
    catch(er){

        logger.warn("Error occured while editing the notes.. " , er);
        return res.status(500).json({
            message:"Internal Server Error"
        })
         
    }
})


Edit_Router.post("/setPin"  , Authentication_token , async(req,res)=>{
       
  try{
    
    const workspace = req.body.workspace;
    const find_workspace = await workspace_model.findOne({workspace_name : workspace})

    if(!find_workspace){
        logger.warn("Workspace is not present . please check...");
        return res.status(404).json({
          message:"Workspace is not present.."
        })
    }


    find_workspace.pin = !find_workspace.pin;

    await find_workspace.save();

    logger.info("Pin changed successfully..");

    return res.status(200).json({
       message:"Pin changed successfully..."
    })

  }
  catch(er){

    logger.warn("Error occured while setting the pin for the workspace" , er);
    return res.status(500).json({
      message : "Internal server error",
      error:er
    })

  }
})







export default Edit_Router;