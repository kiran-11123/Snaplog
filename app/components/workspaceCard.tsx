"use client"

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { Pin } from 'lucide-react';

interface Components {
   
    _id:string,
    workspace_name: string,
    pin :boolean
   

}

export default function WorkspaceCard({ workspace_name ,pin }: Components) {
   
    const router = useRouter();
    const[message , setMessage] = useState('');

    async function  ToWorkSpace(workspace_name:string){

     router.push(`/workspace/${encodeURIComponent(workspace_name)}`);
        


        
    }

    async function setPin( workspace:string) {
          
        try{

            const response = await axios.post("https://snaplog-6.onrender.com/api/v1/edit/setPin" , {
                workspace : workspace_name
            },{
                withCredentials:true
            })

            if(response.status===200){
                 setMessage(response.data.message);
                window.location.reload();


            }
            else{
                setMessage(response.data.message);
            }

        }
        catch(er){
             console.log(er)
             setMessage("Error Occured while pinning the workspace")
        }

        finally{
             setTimeout(()=>{
                   setMessage('');
             },1000)
        }
    
    }

    async function DeleteWorkspace( workspace:string) {

        try{

            const response = await axios.post("https://snaplog-6.onrender.com/api/v1/delete/delete_workspace" , {
                workspace_name : workspace
            },{
                withCredentials:true
            })

            if(response.status===200){
                 setMessage(response.data.message);
                 window.location.reload();
            }
            else{
                 setMessage(response.data.message);
            }

        }
        catch(er){
             console.log(er);
            setMessage("Error Occured while deleting..")

        }
        finally{
            setTimeout(()=>{
                  setMessage('')
            },1000)
        }
        
    }
    
   
    return(

     <div className="w-full max-w-sm  backdrop-blur-xl bg-white/20  border-white h-96 p-4 shadow-xl rounded-md flex flex-col border items-center justify-between">
             
             <div className='w-full flex items-center justify-between mb-1'>

            <h1 className="text-center px-2 py-1 font-poppins font-semibold  text-lg">
               {workspace_name}
            </h1>

            <div className='flex items-center justify-between gap-2'>
                         <button onClick={() => setPin(workspace_name)}  className={`font-sm cursor-pointer rounded-full transition-shadow ${pin ? " text-red-500" : "text-black"
                            }`} title="X"> <Pin /></button>


                         <button onClick={() => DeleteWorkspace(workspace_name)} className='font-sm rounded-full hover:transition-shadow' title="X"> <Trash /></button>
             

                        </div>

            

            </div>

              <div className="w-full flex-1 mb-3 overflow-auto  custom-scrollbar font-mono bg-gray-700/80  rounded-lg shadow-lg text-white text-sm sm:text-md px-2 py-1 whitespace-pre-wrap leading-relaxed">
                <button title="plus" onClick={()=>ToWorkSpace(workspace_name)} className='flex flex-col  items-center justify-center h-full w-full text-white font-bold  '>
                    <Plus size={48} strokeWidth={2.5} className='mb-2'/>
                 
                </button>
            </div>


            {message && <div className='text-md w-full font-inter text-gray-800'>{message}</div>}



    </div>

)}