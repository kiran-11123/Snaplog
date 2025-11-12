"use client"

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface Components {
   
    _id:string,
    workspace_name: string,
   

}

export default function WorkspaceCard({ workspace_name }: Components) {
   
    const router = useRouter();

    async function  ToWorkSpace(workspace_name:string){

      
        router.push(`/workspace?title=${encodeURIComponent(workspace_name)}`);


        
    }
    
   
    return(

     <div className="w-full max-w-sm  backdrop-blur-xl bg-white/20  border-white h-96 p-4 shadow-xl rounded-md flex flex-col border items-center justify-between">
             
             <div className='w-full flex items-center justify-center mb-1'>

            <h1 className="text-center px-2 py-1 font-poppins font-semibold  text-lg">
               {workspace_name}
            </h1>
            
            

            </div>

              <div className="w-full flex-1 mb-3 overflow-auto  custom-scrollbar font-mono bg-gray-700/80  rounded-lg shadow-lg text-white text-sm sm:text-md px-2 py-1 whitespace-pre-wrap leading-relaxed">
                <button title="plus" onClick={()=>ToWorkSpace(workspace_name)} className='flex flex-col  items-center justify-center h-full w-full text-white font-bold  '>
                    <Plus size={48} strokeWidth={2.5} className='mb-2'/>
                 
                </button>
            </div>


    </div>

)}