"use client"

import AuthGuard from "../components/AuthGuard"

export default function Home(){
     return(

        <AuthGuard >
        <div className="h-screen bg-gray-100  flex items-center">

            <div className="flex justify-between items-center p-2 bg-blue-600 text-white text-2xl shadow-xl hover:bg-blue-900 ">

                

            </div>
            Welcome to Home
        </div>

        </AuthGuard>
     )
}