"use client"
import axios from "axios";
import React, { useState, FormEvent } from "react";

function Notes({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const [note, setNote] = useState('');
    const[message , setMessage]=useState('');

    if (!isOpen) return null;


    async function handleAI(e:any) {

        e.preventDefault();


        try{

            const response = await axios.post("http://localhost:5000/api/vl/ai/content" , {
                question:note
            }, {withCredentials : true})

            
            if(response.status===200){
                 
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

            
            setTimeout(()=>{

                    setMessage('');
                    setNote('');

                },2000)

             

        }
        
    }


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
        <div className="fixed inset-0 bg-gray-200 bg-opacity-80 flex items-center justify-center z-80">
            
            <div className="bg-white w-full max-w-xl rounded-lg shadow-md p-6 space-y-4">

                <h2 className="text-xl text-blue-700 ">Add Notes</h2>

                <form  className="space-y-3" >

                    <textarea 
                      
                      value={note}
                      onChange={(e)=> setNote(e.target.value)}
                      placeholder="Write your note...."
                      className="w-full h-72 border text-sm font-mono rounded p-3 focus:ring focus:ring-blue-600 overflow-auto"
                    
                    />

                    <div className="flex justify-end gap-2 text-sm">

                        <button onClick={handleAI} className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#0f172a]  to-[#334155] hover:bg-gradient-to-r hover:from-[#0f172a] hover:to-[#628bc4] shadow-lg rounded-lg text-white">AI To Optimize</button>

                        <button onClick={onClose} className="cursor-pointer px-4 py-2 bg-gradient-to-bl from-[#f97316] via-[#dc2626] to-[#be123c] hover:bg-gradient-to-bl hover:from-[#f97316] hover:via-[#dc2626] hover:to-[#83132f] shadow-lg rounded-lg text-white">Cancel</button>
                        <button onClick={handleSubmit} className=" cursor-pointer px-4 py-2 bg-gradient-to-tr from-[#0891b2] via-[#1d4ed8] to-[#3730a3]  hover:bg-gradient-to-tr hover:from-[#299ab7] hover:via-[#13399f] hover:to-[#140f5e] shadow-lg rounded-lg text-white">Save Note</button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default Notes;