"use client"
import axios from "axios";
import { X } from 'lucide-react';


import React, { useState, FormEvent } from "react";

function Workspace({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const [title, setTitle] = useState('');
    const[message , setMessage]=useState('');
    
  

    if (!isOpen) return null;

    

   

    async function handleSubmit(e:any) {

        e.preventDefault();
       


        try{


            const response = await axios.post("http://localhost:5000/api/v1/workspace/create" , {
                
               workspace_title :  title
            }, {withCredentials : true})

            if(response.status===200){
                 
                setMessage(response.data.message);
                setTimeout(()=>{
                    window.location.reload();
                },1000)
            }
            else{
                setMessage(response.data.message)
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
                    
                setTitle('');
                    setMessage('');
                    

                },2000)

        }
        
    }
    

    return (
       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white max-w-lg w-[90%] rounded-lg shadow-md p-6 space-y-4">
        
        <div className="flex items-center justify-between">
            <h2 className="text-xl text-blue-700">Create workspace</h2>
            <button title="X" onClick={onClose} className="hover:text-red-600">
                <X />
            </button>
        </div>
        
        <form className="space-y-3">
            <input 
              onChange={(e) => setTitle(e.target.value)}
              required 
              value={title}
              className="w-full px-4 py-2 rounded-md border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter Workspace Name"
              type="text" 
            />

            <div className="flex justify-end gap-2 text-sm mb-5">
                <button onClick={handleSubmit} className="px-4 py-2 cursor-pointer bg-gradient-to-tr from-[#0891b2] via-[#1d4ed8] to-[#3730a3] text-white rounded-lg">
                    Submit
                </button>
            </div>

            {message && <p className="text-right text-sm text-red-500">{message}</p>}
        </form>
    </div>
</div>

    );
}

export default Workspace;