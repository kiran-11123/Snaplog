import mongoose  from "mongoose";


const Favourites = new mongoose.Schema({


     user_id: {type:Number , unique:true} ,

           Favourites:[{
        
        id:{type:String},
        title:{type:Object},
        data:{type:Object},
        favourite :{type:Boolean , default:false},
        
        createdAt:{type:Date , default:Date.now}


     }]
   
    
       
})


const Favourites_model = mongoose.model("User_data" , Favourites);



export default Favourites_model;