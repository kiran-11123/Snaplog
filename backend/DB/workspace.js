import express from 'express'
import mongoose from 'mongoose'

const workspace_Schema = new mongoose.Schema({
      
    workspace_name:{type:String},
    userid :{type:Number } , 

     notes:[{
        title:{type:Object},
        data:{type:Object},
        
      createdAt:{type:Date , default:Date.now}


     }],

})


const workspace_model  = mongoose.model("workspace_data" , workspace_Schema);



export default workspace_model;