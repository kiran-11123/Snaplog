import mongoose  from "mongoose";


const data_Schema = new mongoose.Schema({
   
     id :{type:Number } , 
     data:[{
        
        text:{type:String},
        images:{type:String},
        


     }]
       
})


const data_model = mongoose.model("User" , data_Schema);



export default data_model;