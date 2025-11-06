"use client"
import axios from "axios";
import React, { useState, FormEvent } from "react";

function Notes({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const [note, setNote] = useState('');
    const[message , setMessage]=useState('');

    if (!isOpen) return null;


    async function handleSubmit(e:any) {

        e.preventDefault();


        try{
            

            const response = await axios.post("http://localhost:5000/api/v1/data/upload-data",{
                data : note
            },{
                withCredentials:true
            })

            if(response.status==200){
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
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
            
            <div className="bg-white w-full max-w-xl rounded-lg shadow-md p-6 space-y-4">

                <h2 className="font font-2xl ">Add Notes</h2>

                <form  className="space-y-3" >

                    <textarea 
                      
                      value={note}
                      onChange={(e)=> setNote(e.target.value)}
                      placeholder="Write your note...."
                      className="w-full h-72 border text-sm font-mono rounded p-2 focus:ring focus:ring-blue-600 overflow-auto"
                    
                    />

                    <div className="flex justify-end gap-2 text-sm">

                        <button>AI To Optimize</button>

                        <button onClick={onClose} className="px-4 py-2 bg-blue-600 shadow-lg rounded-lg text-white">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 shadow-lg rounded-lg text-white">Save Note</button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default Notes;