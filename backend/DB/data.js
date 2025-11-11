import mongoose  from "mongoose";


const data_Schema = new mongoose.Schema({

     
   
     userid :{type:Number } , 
     
     notes:[{
        title:{type:Object},
        data:{type:Object},
        
      createdAt:{type:Date , default:Date.now}


     }],
    
       
})


const data_model = mongoose.model("User_data" , data_Schema);



export default data_model;