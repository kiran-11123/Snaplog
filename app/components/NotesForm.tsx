"use client"
import axios from "axios";
import { X } from 'lucide-react';

import React, { useState, FormEvent } from "react";

function Notes({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const [note, setNote] = useState('');
    const[message , setMessage]=useState('');
    const[loading , SetLoading] = useState(false);

    if (!isOpen) return null;


    async function handleAI(e:any) {

        e.preventDefault();

         if(note.trim()===''){
                setMessage("Please enter some note to optimize...");
                return;
            }

        if(loading) return;

  
         SetLoading(true);




        try{

           

            const response = await axios.post("http://localhost:5000/api/v1/ai/content" , {
                question:note
            }, {withCredentials : true})

            
            if(response.status===200){
                console.log(response.data.data);
                 
                setNote(response.data.data);
               
                setMessage("AI generated the Data...")
            }
            else{
              
                setMessage(response.data.message);
            }

        }
        catch(er){
          
             
            setMessage("AI didn't generate the response..")
        }

        finally{
            SetLoading(false);
            
            setTimeout(()=>{

                    setMessage('');
                 
                },4000)

             

        }
        
    }


    async function handleSubmit(e:any) {

        e.preventDefault();
       


        try{

            const split = note.split('\n')[0];
            

            const response = await axios.post("http://localhost:5000/api/v1/data/upload_data",{
                title:split,
                data : note
            },{
                withCredentials:true
            })

            if(response.status==200){
                 window.location.reload();
                setMessage("Notes Added Successfully...")


               
            }
            else{
                 
                setMessage(response.data.message);

                

            }


        }
        catch(er){
              
            if (typeof er === "object" && er !== null && "response" in er) {
                const error = er as any;
                if (error.response && error.response.data && error.response.data.message) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('error in submitting');
                }
            } else {
                setMessage('error in submitting');
            }


           

        }

        finally{

            setTimeout(()=>{

                    setMessage('');
                    setNote('');

                },2000)

        }
        
    }
    

    return (
         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            
             <div className="bg-white max-w-lg w-[90%] rounded-lg shadow-md p-6 space-y-4">
                 
                 <div className="flex items-center justify-between ">

                    <h2 className="text-xl text-blue-700 ">Add Notes</h2>

                    <button title="X" onClick={onClose} className="hover:text-red-600border rounded-full "><X /></button>


                 </div>


                <form  className="space-y-3" >

                    <textarea 
                      
                      value={note}
                      onChange={(e)=> setNote(e.target.value)}
                      placeholder="Write your note...."
                      className="w-full h-72 border text-sm font-mono rounded p-3 focus:ring focus:ring-blue-600 overflow-auto"
                    
                    />

                    <div className="flex justify-end gap-2 text-sm mb-5">

                        <button onClick={handleAI} disabled={loading} className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#0f172a]  to-[#334155] hover:bg-gradient-to-r hover:from-[#0f172a] hover:to-[#628bc4] shadow-lg rounded-lg text-white">{loading ? "Generating.." : "Optimize Using AI" }</button>
                        <button  onClick={handleSubmit} className=" cursor-pointer px-4 py-2 bg-gradient-to-tr from-[#0891b2] via-[#1d4ed8] to-[#3730a3]  hover:bg-gradient-to-tr hover:from-[#299ab7] hover:via-[#13399f] hover:to-[#140f5e] shadow-lg rounded-lg text-white">Save Note</button>

                      
                    </div>

                    <div className="flex justify-end gap-2 text-sm mb-5">{message ? <p className="text-red-500">{message}</p> : null} </div>
                </form>

            </div>
        </div>
    );
}

export default Notes;