"use client"




import { Plus } from "lucide-react";
import AuthGuard from "../components/AuthGuard"
import { useSearchParams } from "next/navigation";
import { use, useState , useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Card from "../components/Card";


import Notes from "../components/NotesForm";

interface Components {
    _id:string,
    title: string,
    data: string,
    createdAt: Date;


}


export default function Home(){

  

 const [data, SetData] = useState<Components[]>([]);

  useEffect(()=>{

    async function FetchData(){
         
      try{

        const response = await axios.get("http://localhost:5000/api/v1/data/get_data" , {
          withCredentials:true
        }) 

        if(response.status===200){
           SetData(response.data.data);
           
        }
        

      }
      catch (err) {
        console.error("Error fetching content", err);
      }
    }

    FetchData();
        
  },[data])

 

  const router = useRouter();
  function logoutHandler(){

        localStorage.removeItem("token");
        router.replace("/");
    }

  const[openModal , setOpenModal] = useState(false);
     return(

        <AuthGuard >
        <div className="bg-gray-100  flex  flex-col justify-between w-full">

            <div className="flex justify-between items-center mt-2  w-full text-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#44403c] via-[#78716c] to-[#d6d3d1] rounded-md px-6 py-4 font-bold text-2xl shadow-xl ">
                  
                  <h1 className="font-serif px-4 py-2 rounded-lg shadow-2xl bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#27272a] via-[#52525b] to-[#a1a1aa]">NeuraNote</h1>
                  

                   
                  <div className="px-15  py-2 flex items-center justify-between gap-10 text-lg">
                    <button title="add-content"  onClick={()=>setOpenModal(true)}   className="bg-yellow-500 text-white cursor-pointer  hover:bg-gradient-to-r hover:from-yellow-500 hover:via-yellow-500 to-yellow-800 rounded-full px-2 py-2"><Plus /></button>
                    <button onClick={logoutHandler}  className="px-4 cursor-pointer py-2 font-mono bg-gradient-to-b from-[#818cf8] via-[#6366f1] to-[#4f46e5] hover:bg-gradient-to-b hover:from-[#818cf8] hover:via-[#242568] hover:to-[#4f46e5] text-white  rounded-lg font-bold">Logout</button>
                  </div>
                  


                  <Notes isOpen ={openModal } onClose={()=>setOpenModal(false)} /> 

                  
                

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 p-4 justify-center items-center md:grid-cols-3 gap-6 mt-5">
            {data && data.length > 0 ? (
             data.map((item : Components) => (
              <div
                key={item._id}
                className="transition-all flex border items-center max-w-md justify-center duration-300 ease-in-out hover:outline hover:outline-2 hover:outline-blue-300 hover:border hover:border-blue-400 hover:shadow-xl hover:shadow-gray-300/50 rounded-l"
              >
                <Card
                  id={item._id}
                  title={item.title}
                  data={item.data}
                  created_at={item.createdAt}
                 
                  
                 
                />
              </div>
            ))
          ) : (
            <p className="text-center text-lg sm:text-xl font-semibold col-span-full font-poppins ">
              Notes Empty
            </p>
          )}
        </div>
      
   

           
          
        </div>

        </AuthGuard>
     )
}

