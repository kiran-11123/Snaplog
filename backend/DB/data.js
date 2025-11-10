import mongoose  from "mongoose";


const data_Schema = new mongoose.Schema({
   
     id :{type:Number } , 
     data:[{
        
        text:{type:String},
        
        


     }]
       
})


const data_model = mongoose.model("User_data" , data_Schema);



export default data_model;