"use client"
import React, { useState, FormEvent } from "react";

function Notes({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const [note, setNote] = useState('');
    const[message , setMessage]=useState('');

    if (!isOpen) return null;
    async function handleSubmit(e:any) {


        try{

            

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


            setTimeout(() => {
               setNote('');
              
            }, 3000)
            

        }
        
    }
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            
            <div className="bg-white w-full max-w-xl rounded-lg shadow-md p-6 space-y-4">

                <h2 className="font-bold font-2xl ">Add Notes</h2>

                <form  className="space-y-3" >

                    <textarea 
                      
                      value={note}
                      onChange={(e)=> setNote(e.target.value)}
                      placeholder="Write your note...."
                      className="w-full h-42 border text-sm font-mono rounded p-2 focus:ring focus:ring-blue-300"
                    
                    />

                    <div className="flex justify-end gap-2 text-lg">

                        <button onClick={onClose} className="px-4 py-2 bg-blue-600 shadow-lg rounded-lg text-white">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 shadow-lg rounded-lg text-white">Save Note</button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default Notes;