import mongoose  from "mongoose";


const User_Schema = new mongoose.Schema({
     email:{type:String},
     username:{type:String},
     files:[{
        fileName:String,
        fileUrl:String,
        fileType:String,
        uploadedAt:{type:Date ,default:Date.now()}
     }]
})


const user_model = mongoose.model("User" , User_Schema);



export default user_model;