"use client"

import { useState } from "react";
import { X } from 'lucide-react';
import axios from "axios";

export default function EditNote({ isOpen, onClose  , data , id , workspace_name}: { isOpen?: boolean; onClose?: () => void , data: string , id:string , workspace_name:string}){

    const[newdata,setNewData] = useState(data) ;
    const[message , setMessage] = useState('');
 const [loading, setLoading] = useState(false);

        if (!isOpen) return null;


    async function handleSubmit(e:any) {

        e.preventDefault();

        if (newdata.trim() === '') {
            setMessage("Note cannot be empty");
            return;
        }

        if (loading) return;

        setLoading(true);

        try{

            console.log(id , workspace_name , newdata);

             const response = await axios.post(
                "http://localhost:5000/api/v1/edit/edit_notes",
                {
                    contentId: id,
                    workspace_name: workspace_name,
                    data: newdata
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setMessage("Note updated successfully");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setMessage(response.data.message || "Failed to update note");
            }

        }
        catch(er){
            console.log("Error while Editing the data")
        }
        finally {
            setLoading(false);
        }
        
    }
       
    return(
          <div className="fixed inset-0 bg-black/40 flex w-full items-center justify-center z-50">
            
             <div className="bg-white w-full h-full flex flex-col p-6 space-y-4">
                
                <div className="flex items-center justify-between">
                    <h2 className="text-xl text-blue-700">Edit Notes</h2>
                    <button title="X" onClick={onClose} className="hover:text-red-600">
                        <X />
                    </button>
                </div>
                
               <form className="flex-1 flex flex-col space-y-3">
                    <textarea 
                      onChange={(e) => setNewData(e.target.value)}
                      required 
                      value={newdata}
                      className="flex-1 w-full px-4 py-2 rounded-md border-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none overflow-auto"
                      placeholder="Edit data"
                    />
        
                    <div className="flex justify-end gap-2 text-sm">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
                            Cancel
                        </button>
                        <button type="submit" onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-gradient-to-tr from-[#0891b2] via-[#1d4ed8] to-[#3730a3] text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                            {loading ? "Saving..." : "Submit"}
                        </button>
                    </div>
        
                    {message && <p className="text-right text-red-500">{message}</p>}
                </form>
            </div>
        </div>
    )
}