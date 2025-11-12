import express from 'express'
const data_Router = express.Router();
import Authentication_token from '../../middlewares/Authentication_middeware.js';
import data_model from '../../DB/data.js';
import mongoose from 'mongoose';
import transporter from '../user/Mail.js';
import logger from '../../utils/logger.js';
import { producer ,setupKafka , TOPIC  } from '../kafka/producer.js';
import workspace_model from '../../DB/workspace.js';


data_Router.post("/upload_data", Authentication_token, async (req, res) => {

    try {

        logger.info("Request: POST /upload_data");

        const data_received = req.body.data;
        const title = req.body.title;
        const workspace = req.body.workspace;

        console.log("data is ", data_received )
          console.log("title is ", title )
          console.log("workspace is" , workspace)

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
                workspace_name : workspace_title,
                userid: user_id,
                notes : []
            })
           
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
        const workspace = req.body.workspace_title;

        


        const user = await workspace_model.findOne({ workspace_name: workspace }); 

         console.log("user data is " , user)
        if (user.notes.length === 0) {
              logger.info(`No notes found for user: ${user_id}`);
            return res.status(200).json({
                message: "Your Notes are Empty.",
                data: []
            });
        }

         logger.info(`Fetched ${user.notes.length} notes for user: ${user_id}`);

        return res.status(200).json({
            message: "Data Fetched Successfully.",
            data: user.notes
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
        objId = new mongoose.Types.ObjectId(objId);

        const user_id = req.user.user_id;

        const user = await data_model.findOneAndUpdate(
            { userid: user_id },
            { $pull: { notes: { _id: objId } } },
            { new: true }
        );

        if (user) {

              logger.info(`Note deleted for user: ${user_id}`);
            return res.status(200).json({
                message: "Content Deleted Successfully"
            })
        }

         logger.warn(`Delete attempt failed — note not found for user: ${user_id}`);

        return res.status(404).json({
            message: "Content Not found"
        });



    }
    catch (er) {

        logger.error("Error in /delete: " + er.message);

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})


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








export default data_Router;