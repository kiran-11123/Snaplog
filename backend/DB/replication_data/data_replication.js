import mongoose, { mongo } from "mongoose";
import express from "express";


const Favourites_replication_schema = new mongoose.Schema({

     user_id: {type:Number , unique:true} ,

           Favourites:[{
        
        id:{type:String},
        title:{type:Object},
        data:{type:Object},
        favourite :{type:Boolean , default:false},
        
        createdAt:{type:Date , default:Date.now}


     }]
   
       
})

const Favourites_replication_model = mongoose.model("Favourites_replication" , Favourites_replication_schema);



export default Favourites_replication_model;