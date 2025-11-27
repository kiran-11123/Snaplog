"use client"
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Share2 } from 'lucide-react';
import axios from 'axios';
import DataShare from './DataShare';
import { Heart } from 'lucide-react';
import { SquarePen } from 'lucide-react';
import EditNote from './editNotes';

interface Components {
    id: string,
    workspace_name: string,
    title: string,
    data: string,
    created_at: Date
    favourite: boolean
    disabled?: boolean;

}





export default function Card({ workspace_name, id, title, data, created_at, favourite, disabled }: Components) {

    const [copied, setCopied] = useState(false);

    const [open1, setOpenModal1] = useState(false);

    const [open2, setOpenModal2] = useState(false);
    const [message, setMessage] = useState<string>("");



    async function HandleFavourites(id: string) {

        try {

            const response = await axios.post(
                "https://snaplog-6.onrender.com/api/v1/data/favourites",
                {
                    contentId: id,
                    workspace_name: workspace_name,
                },
                {
                    withCredentials: true,
                }
            );
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

            console.log(er);
            alert("Error occured while making favourites: ");

        }

    }



    async function DeleteNotes(id: string) {



        try {


            const response = await axios.delete("https://snaplog-6.onrender.com/api/v1/delete/delete", {
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
                console.log(response.data)
            }

        }
        catch (er) {

            console.log(er);
            setMessage("Error Occured while deleting..")

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

        <div className=" w-full max-w-md   backdrop-blur-xl bg-white/20  border-white h-96 p-4 shadow-xl rounded-md flex flex-col border items-center justify-between">

            <div className='w-full flex items-center justify-between mb-1'>

                <h1 className="text-center px-2 py-1 font-poppins font-semibold  text-lg">
                    {title}
                </h1>

                <div className='flex justify-between gap-4 items-center'>

                    {!disabled && (<button
                        onClick={() => HandleFavourites(id)}
                        className={`font-sm cursor-pointer rounded-full transition-shadow ${favourite ? " text-red-500" : "text-black"
                            }`}
                        title="heart"
                    >
                        <Heart />
                    </button>)}

                    {!disabled && (<button onClick={() => setOpenModal1(true)} className='font-sm rounded-full hover:transition-shadow' title="X"> <Share2 /></button>)}


                    {!disabled && (<button onClick={() => DeleteNotes(id)} className='font-sm rounded-full hover:transition-shadow' title="X"> <Trash /></button>)}


                </div>


                {open1 && <DataShare isOpen={open1} onClose={() => setOpenModal1(false)} data={data} />}



            </div>

            <div className="w-full flex-1 mb-3 overflow-auto  custom-scrollbar font-mono bg-gray-700/80  rounded-lg shadow-lg text-white text-sm sm:text-md px-2 py-1 whitespace-pre-wrap leading-relaxed">
                {data}
            </div>






            <div className='flex items-center w-full  justify-between'>

                <span className='font-inter text-gray-900/80'>



                    <span className='font-semibold'>Saved on : </span>{created_at ? created_at.toString().split('T')[0] : 'No date'}


                </span>

       {!disabled  &&   
             (<div className='flex justify-between gap-2'>
                    <button onClick={() => setOpenModal2(true)} className='font-sm rounded-full hover:transition-shadow' title="X"> <SquarePen /></button>

                    { open2 && (
                        <EditNote
                            isOpen={open2}
                            onClose={() => setOpenModal2(false)}
                            data={data}
                            id={id}
                            workspace_name={workspace_name}
                        />
                    )}

                    <button title="Copy" onClick={handleCopy} className='flex items-center p-2 bg-gray-300 rounded-md hover:bg-gray-400 hover:opacity-80 transition-shadow shadow-md'>
                        <Copy size={16} color='black' />

                        {copied && <span className='text-xs text-black '>Copied!</span>}
                    </button>

                </div>   )}



            </div>


            {message && <div className='text-md w-full font-inter text-gray-800'>{message}</div>}






        </div>

    )
}