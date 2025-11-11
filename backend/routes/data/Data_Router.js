import express from 'express'
const data_Router = express.Router();
import Authentication_token from '../../middlewares/Authentication_middeware.js';
import data_model from '../../DB/data.js';
import mongoose from 'mongoose';




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

        let user = await data_model.findOne({userid : user_id})

        if(!user){
             
            user = new data_model({
                userid :user_id,
              
                notes:[{
                   title,
                   data:data_received
                }]
           
                    
                    
            })
        }

        else{

            user.notes.push({
                title,
                data :data_received
            });
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





data_Router.get("/get_data", Authentication_token, async (req, res) => {
  try {
    const user_id = req.user.user_id;
   

    const user = await data_model.findOne({ userid: user_id }); // ✅ important fix


    if (user.notes.length === 0) {
      return res.status(200).json({
        message: "Your Notes are Empty.",
        data: []
      });
    }

    return res.status(200).json({
      message: "Data Fetched Successfully.",
      data: user.notes
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json({
      message: "Internal Server Error",
      error: er
    });
  }
});



data_Router.delete("/delete" , Authentication_token , async(req,res)=>{
      

    try{

        let objId = req.body.contentId;
        objId = new mongoose.Types.ObjectId(objId);

        const user_id = req.user.user_id;

        const user = await data_model.findOneAndUpdate(
            { userid : user_id },
            { $pull: { notes: { _id: objId } } },
            { new: true }
        );

        console.log(user);

        if(user){
            return res.status(200).json({
                message:"Content Deleted Successfully"
            })
        }

        return res.status(404).json({
            message:"Content Not found"
        });



    }
    catch(er){

        console.log(er);
         
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
})


data_Router.post("/share" , Authentication_token , async(req,res)=>{
        
    try{

         const email = req.body.email;
         const data = req.body.data;

    }
    catch(er){
         
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
})








export  default data_Router;