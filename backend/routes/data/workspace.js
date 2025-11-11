import express from 'express';
const workspace_Router = express.Router();
import Authentication_token from '../../middlewares/Authentication_middeware.js';
import logger from '../../utils/logger.js';
import workspace_model from '../../DB/workspace.js';



workspace_Router.post("/create" , Authentication_token , async(req,res)=>{
      
    try{

        logger.info("Request: workspace POST /create");

        const user_id = req.user.user_id

        const workspace_title = req.body.workspace_title;
         
    
        let check_workspace = await workspace_model.findOne({workspace_name : workspace_title})
        
        if(check_workspace){
            logger.warn("Workspace has already created with this name..")
            return res.status(400).json({
                message:"Workspace name alaready exists.."
            })
        }

        if(!check_workspace){
             
            check_workspace = new workspace_model({
                workspace_name : workspace_title,
                userid: user_id,
                notes : []
            })
        }

        await check_workspace.save();
        
         logger.info(`WorkSpace with name ${workspace_title} is created successfully`)
        return res.status(200).json({
           
         message:"workspace successfully created.."
        })





    }
    catch(er){

        logger.warn("Error occuring while creating the workspace " , er);

        return res.status(500).json({
            message:"Internal Server Error"
        })

    }
})


workspace_Router.get("/get_data" , Authentication_token , async(req,res)=>{

    try{

         logger.info("Request: workspace Get /get_data");
         const user_id = req.user.user_id;

       

     
        let check_workspace = await workspace_model.find({userid : user_id})
        
        if(!check_workspace){
            logger.warn("Workspace is not present ")
            return res.status(400).json({
                message:"Workspace didn't exists.."
            })
        }

        logger.info("Workspace data fetched successfully...")

         console.log(check_workspace);
        return res.status(200).json({
            message:"Workspace data fetched successfully...",
            data:check_workspace
        })




    }
    catch(er){

        logger.warn("Error while fetching the workspaces " , er);
        return res.status(500).json({
            message:"Internal Server Error.."
        })

    }
})
















export default workspace_Router