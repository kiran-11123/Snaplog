import mongoose  from "mongoose";


const data_Schema = new mongoose.Schema({
   
     id :{type:Number } , 
     title:{type:String},
     data:[{
        
        text:{type:String},
        
        


     }],
     createdAt:{type:Date , default:Date.now}
       
})


const data_model = mongoose.model("User_data" , data_Schema);



export default data_model;