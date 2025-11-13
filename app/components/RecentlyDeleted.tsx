"use client"
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { ArchiveRestore } from 'lucide-react';

interface Components {
    id: string,
    workspace_name: string,
    title: string,
    data: string,
    created_at: Date
    

}





export default function DeleteCard({  workspace_name, id , title, data, created_at  }: Components) {

    const [copied, setCopied] = useState(false);
    const [message, setMessage] = useState<string>("");

  
    async function RestoreNote(id: string) {



        try {


            const response = await axios.delete("http://localhost:5000/api/v1/data/restore", {
                data: {
                    contentId: id,
                    workspace_name: workspace_name

                },
                withCredentials: true
            })

            console.log(response);

            if (response.status === 200) {
                setMessage(response.data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            else {
                setMessage(response.data.message);   
            }

        }
        catch (er) {

            setMessage("Error Occured while restoring..")

        }

    }


  

  

    async function PermanentDeleteNotes(id: string) {



        try {


            const response = await axios.delete("http://localhost:5000/api/v1/data/permanent_delete", {
                data: {
                    contentId: id,
                    workspace_name: workspace_name

                },
                withCredentials: true
            })

            console.log(response);

            if (response.status === 200) {
                setMessage(response.data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            else {
                setMessage(response.data.message);   
                
            }

        }
        catch (er) {

            setMessage("Error Occured while deleting permanently..")

        }

    }

    async function handleCopy() {

        try {
            await navigator.clipboard.writeText(data);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {

            console.error('Failed to copy text: ', err);
        }

    }
    return (

        <div className="w-full max-w-md  backdrop-blur-xl bg-white/20  border-white h-96 p-4 shadow-xl rounded-md flex flex-col border items-center justify-between">

            <div className='w-full flex items-center justify-between mb-1'>

                <h1 className="text-center px-2 py-1 font-poppins font-semibold  text-lg">
                    {title}
                </h1>

                <div className='flex justify-between gap-4 items-center'>

                   
                       

                    <button onClick={() => RestoreNote(id)} className='font-sm rounded-full hover:transition-shadow' title="X"> <ArchiveRestore /></button>


                    <button onClick={() => PermanentDeleteNotes(id)} className='font-sm rounded-full hover:transition-shadow' title="X"> <Trash2 /></button>


                </div>





            </div>

            <div className="w-full flex-1 mb-3 overflow-auto  custom-scrollbar font-mono bg-gray-700/80  rounded-lg shadow-lg text-white text-sm sm:text-md px-2 py-1 whitespace-pre-wrap leading-relaxed">
                {data}
            </div>






            <div className='flex items-center w-full  justify-between'>

                <span className='font-inter text-gray-900/80'>



                    <span className='font-semibold'>Saved on : </span>{created_at ? created_at.toString().split('T')[0] : 'No date'}


                </span>

                <button title="Copy" onClick={handleCopy} className='flex items-center p-2 bg-gray-300 rounded-md hover:bg-gray-400 hover:opacity-80 transition-shadow shadow-md'>
                    <Copy size={16} color='black' />

                    {copied && <span className='text-xs text-black '>Copied!</span>}
                </button>

                {message && <div className='text-md w-full font-inter text-gray-800'>{message}</div> }

            </div>






        </div>

    )
}