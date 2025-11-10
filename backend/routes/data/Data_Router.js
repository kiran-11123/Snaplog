import express from 'express'
const data_Router = express.Router();
import Authentication_token from '../../middlewares/Authentication_middeware.js';
import data_model from '../../DB/data.js';




data_Router.post("/upload_data" ,Authentication_token , async(req,res)=>{
      
    try{

        const data = req.body.data;

        if(!data || data.length===0){
            return res.status(403).json({
                message:"Data Not found to store"
            })
        }

        const user_id =  req.user.user_id;

        const user = await data_model.findOne({id : user_id})

        if(!user){
             
            user = new data_model({
                user_id ,
                data:[{text}]
            })
        }

        else{
            user.data.push({data});
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



















export  default data_Router;