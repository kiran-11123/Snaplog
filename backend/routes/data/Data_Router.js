import express from 'express'
const data_Router = express.Router();
import Authentication_token from '../../middlewares/Authentication_middeware.js';
import data_model from '../../DB/data.js';
import mongoose from 'mongoose';
import transporter from '../user/Mail.js';


data_Router.post("/upload_data", Authentication_token, async (req, res) => {

    try {

        const data_received = req.body.data;
        const title = req.body.title;

        if (!data_received || data_received.length === 0) {
            return res.status(403).json({
                message: "Data Not found to store"
            })
        }


        const user_id = req.user.user_id;

        let user = await data_model.findOne({ userid: user_id })

        if (!user) {

            user = new data_model({
                userid: user_id,

                notes: [{
                    title,
                    data: data_received
                }]



            })
        }

        else {

            user.notes.push({
                title,
                data: data_received
            });
        }


        await user.save();

        return res.status(200).json({
            messsage: "Data Saved Successfully..."
        })







    }
    catch (er) {

        console.log(er)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})





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



data_Router.delete("/delete", Authentication_token, async (req, res) => {


    try {

        let objId = req.body.contentId;
        objId = new mongoose.Types.ObjectId(objId);

        const user_id = req.user.user_id;

        const user = await data_model.findOneAndUpdate(
            { userid: user_id },
            { $pull: { notes: { _id: objId } } },
            { new: true }
        );

        console.log(user);

        if (user) {
            return res.status(200).json({
                message: "Content Deleted Successfully"
            })
        }

        return res.status(404).json({
            message: "Content Not found"
        });



    }
    catch (er) {

        console.log(er);

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})


data_Router.post("/share", Authentication_token, async (req, res) => {

    try {

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


        return res.status(200).json({


            message: "Data sent successfully..",




        })


    }
    catch (er) {

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})








export default data_Router;