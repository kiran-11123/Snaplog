"use client"

import { Plus } from "lucide-react";
import AuthGuard from "../components/AuthGuard"

export default function Home(){
     return(

        <AuthGuard >
        <div className="bg-gray-100  flex justify-between w-full">

            <div className="flex justify-between items-center mt-2 w-full text-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#44403c] via-[#78716c] to-[#d6d3d1] rounded-md px-6 py-4 font-bold text-2xl shadow-xl ">
                  
                  <h1 className="font-serif px-4 py-2 rounded-lg shadow-2xl bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#27272a] via-[#52525b] to-[#a1a1aa]">NeuraNote</h1>
                  
                  <div className="px-15  py-2 flex items-center justify-between gap-10 text-lg">
                    <button title="add-content" className="bg-yellow-500 text-white cursor-pointer hover:bg-gradient-to-r hover:from-yellow-500 hover:via-yellow-500 to-yellow-800 rounded-full px-2 py-2"><Plus /></button>
                    <button className="px-4 cursor-pointer py-2 font-mono bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold">Logout</button>
                  </div>
                

            </div>
          
        </div>

        </AuthGuard>
     )
}