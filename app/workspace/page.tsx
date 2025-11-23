
"use client"




import { Plus } from "lucide-react";
import AuthGuard from "../components/AuthGuard"
import { permanentRedirect, useSearchParams } from "next/navigation";
import { use, useState , useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Card from "../components/Card";
import { NotebookTabs } from 'lucide-react';
import Workspace from "../components/workspace";
import Notes from "../components/NotesForm";
import { Trash2 } from 'lucide-react';



interface Components {
    _id:string,
    workspace_name: string | null,
    title: string,
    data: string,
    favourite:boolean,
    createdAt: Date;


}

export default function workspace_page(){

       
   const searchParams = useSearchParams();
const title: string = searchParams.get('title') ?? "Default";
const[count,setCount] = useState<number>(0);


 const [data, SetData] = useState<Components[]>([]);

  useEffect(()=>{

    async function FetchData(){
         
      try{

        const response  = await axios.post("http://localhost:5000/api/v1/data/workspace_get_data", {
               workspace_name:title
            } ,{
                withCredentials:true
            })

        if(response.status===200){
           SetData(response.data.data);
           setCount(response.data.count);
        }
        

      }
      catch (err) {
        console.error("Error fetching content", err);
      }
    }

    FetchData();
        
  },[])


   function recentlyDeleted() {

         router.push(`/recentlydeleted?title=${encodeURIComponent(title)}`);
   
  }







 

  const router = useRouter();
  function logoutHandler(){

        localStorage.removeItem("token");
        router.replace("/");
    }


     return(

        <AuthGuard >
        <div className=" flex  flex-col justify-between w-full">

            <div className="flex text-sm sm:text-md justify-between items-center mt-2  w-full text-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#44403c] via-[#78716c] to-[#d6d3d1] rounded-md px-6 py-4 font-bold  shadow-xl ">
                  
            <h1 className="hidden sm:block font-serif px-4 py-2 text-lg mngf rounded-lg shadow-2xl bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#27272a] via-[#52525b] to-[#a1a1aa] text-gray-800">WorkSpace : {title}</h1>
            <h1 className="sm:hidden font-serif px-4 py-2 text-lg mngf rounded-lg shadow-2xl bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#27272a] via-[#52525b] to-[#a1a1aa] text-gray-800">{title}</h1>


            <button title="recently deleted notes" onClick={recentlyDeleted}  className="hidden sm:block px-2 py-2 rounded-lg bg-red-600 text-white  hover:bg-red-800 hover:transition-shadow text-sm">Recent Deletes {count}</button>
            <button title="recently deleted notes" onClick={recentlyDeleted}  className="sm:hidden px-2 py-2 rounded-lg bg-red-500 text-white  hover:bg-red-700 hover:transition-shadow text-sm">Deleted {count}</button>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 p-4 justify-center items-center md:grid-cols-3 gap-6 mt-5">
            {data && data.length > 0 ? (
             data.map((item : Components) => (
              <div
                key={item._id}
                className="transition-all flex border items-center max-w-md justify-center duration-300 ease-in-out hover:outline hover:outline-2 hover:outline-blue-300 hover:border hover:border-blue-400 hover:shadow-xl hover:shadow-gray-300/50 rounded-l"
              >  
            
                <Card
    key={item._id}
    id={item._id}
    workspace_name={title}
    title={item.title}
    data={item.data}
    created_at={item.createdAt}
    favourite={item.favourite}
  />
              </div>
            ))
          ) : (
            <p className="text-center text-lg sm:text-xl font-semibold col-span-full font-poppins ">
              WorkSpace Empty ! check Recently Deleted Notes
            </p>
          )}
        </div>
      
   

           
          
        </div>

        </AuthGuard>
     )
}
