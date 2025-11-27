"use client"
import axios from "axios";
import { X } from 'lucide-react';


import React, { useState, FormEvent } from "react";

function DataShare({ isOpen, onClose  , data}: { isOpen?: boolean; onClose?: () => void , data: string }) {
    const [email, setEmail] = useState('');
    const[message , setMessage]=useState('');
    
  

    if (!isOpen) return null;

    

   

    async function handleSubmit(e:any) {

        e.preventDefault();
       


        try{


            const response = await axios.post("https://snaplog-6.onrender.com/api/v1/data/share" , {
                data,
                email
            }, {withCredentials : true})

            if(response.status===200){
                 
                setMessage("Data Shared Successfully...")
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

                    setMessage('');
                    setEmail('');

                },2000)

        }
        
    }
    

    return (
       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white max-w-lg w-[90%] rounded-lg shadow-md p-6 space-y-4">
        
        <div className="flex items-center justify-between">
            <h2 className="text-xl text-blue-700">Share Notes</h2>
            <button title="X" onClick={onClose} className="hover:text-red-600">
                <X />
            </button>
        </div>
        
        <form className="space-y-3">
            <input 
              onChange={(e) => setEmail(e.target.value)}
              required 
              value={email}
              className="w-full px-4 py-2 rounded-md border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter Email to share"
              type="email" 
            />

            <div className="flex justify-end gap-2 text-sm mb-5">
                <button onClick={handleSubmit} className="px-4 py-2 bg-gradient-to-tr from-[#0891b2] via-[#1d4ed8] to-[#3730a3] text-white rounded-lg">
                    Submit
                </button>
            </div>

            {message && <p className="text-right text-red-500">{message}</p>}
        </form>
    </div>
</div>

    );
}

export default DataShare;