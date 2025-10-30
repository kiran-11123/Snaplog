"use client"

import AuthGuard from "../components/AuthGuard"

export default function Home(){
     return(

        <AuthGuard >
        <div className="bg-gray-100  flex justify-between w-full">

            <div className="flex justify-between items-center mt-2 w-full  bg-blue-600 rounded-md px-6 py-4 text-white text-2xl shadow-xl hover:bg-blue-900 ">

                     Hi

            </div>
          
        </div>

        </AuthGuard>
     )
}