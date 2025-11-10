import express from 'express'
const data_Router = express.Router();
import Authentication_token from '../../middlewares/Authentication_middeware.js';
import data_model from '../../DB/data.js';




data_Router.post("/upload_data" ,Authentication_token , async(req,res)=>{
      
    try{

        const data_received = req.body.data;
        const title  = req.body.title;

        if(!data_received || data_received.length===0){
            return res.status(403).json({
                message:"Data Not found to store"
            })
        }


        const user_id =  req.user.user_id;

        let user = await data_model.findOne({user_id})

        if(!user){
             
            user = new data_model({
                user_id ,
                title:title,
                data:[{ data_received}]
            })
        }

        else{
            user.title = title;
            user.data.push({data_received});
        }


        await user.save();

        return res.status(200).json({
            messsage:"Data Saved Successfully..."
        })







    }
    catch(er){

        console.log(er)
         
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
} )









data_Router.get("/get_data" , Authentication_token , async(req,res)=>{
      
    try{ 

         const user_id =req.user.user_id;


         const user  = await data_model.findOne({user_id});

         if(!user){
            return res.status(200).json({
                message:"Your Notes is Empty.."
            })
         }

         return res.status(200).json({
            message  : "Data Fetched Successfully..",
            data : user.data
         })

    }
    catch(er){

        console.log(er);

        return res.status(500).json({
            message:"Internal Server Error",
            error:er
        })
    }
}) 










export  default data_Router;