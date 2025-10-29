import mongoose  from "mongoose";


const User_Schema = new mongoose.Schema({
     email:{type:String},
     username:{type:String},
     profile: {type:String},
     data:[{
        
        text:{type:String},
        images:{type:String},
        


     }]
       
})


const user_model = mongoose.model("User" , User_Schema);



export default user_model;