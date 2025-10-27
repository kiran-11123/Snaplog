"use client"
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";


export default function Home() {

   const [isOpen, setIsOpen] = useState(false);


   function Login(){

   }

   function Register(){

   }
  return (
    <div className="h-screen flex flex-col items-center  justify-between bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900
">

            <div className="px-6  sm:px-10 py-7 w-full max-w-sm  sm:max-w-4xl rounded-xl bg-gradient-to-r text-white from-[#0f0c29] via-[#302b63] to-[#24243e] hover:bg-gradient-to-r hover:from-[#625c9bad] hover:via-[#302b63] hover:to-[#6565b0] mt-5 flex items-center justify-between" >

                <div className="flex flex-col sm:flex-row items-start sm:items-center font-poppins text-sm sm:text-xl  font-semibold">

                    <h1 className="hover:bg-purple-700 shadow-xl px-4 py-2 rounded-lg ">SnapLog</h1>
                    <span className="text-md sm:text-sm text-purple-300 mt-1 sm:mt-0 sm:ml-2 font-poppins">
                        Think. Share. Inspire.
                    </span>

                </div>

                <div className="hidden sm:flex items-center justify-between gap-10 font-roboto text-md sm:text-lg">

                    <button onClick={Login} className="px-4 py-2 hover:bg-gradient-to-tr from-white/10 via-white/5 to-transparent rounded-lg shadow-md">Login</button>
                    <button onClick={Register}className="px-4 py-2 hover:bg-gradient-to-tr from-white/10 via-white/5 to-transparent rounded-lg shadow-md">Register</button>

                </div>

                <div className='sm:hidden flex items-center'>

                    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                </div>
            </div>

            {isOpen && (
                <div className="sm:hidden w-full max-w-4xl px-6 mt-2 flex flex-col gap-2 bg-[#0f0c29] rounded-xl shadow-lg text-center py-4">
                    <button  onClick={Login} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium">
                        Login
                    </button>
                    <button onClick={Register} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-medium">
                        Register
                    </button>
                </div>
            )}

            <div className="w-full max-w-2xl px-8 py-12 mt-20 mb-16 text-center rounded-2xl bg-white/10 backdrop-blur-md text-white font-nunito shadow-xl hover:shadow-2xl transition">
                <p className="sm:hidden  text-lg sm:text-xl mb-4">
                  A modern social blogging platform where users can share stories, photos, and moments — all in one place.
                </p>
                <p className="text-xl sm:text-2xl font-inter hidden sm:block ">
                   Snaplog is a modern blogging platform designed for creators who love to share thoughts, moments, and stories — instantly. Write, snap, and publish your ideas in seconds with a clean, distraction-free interface.
                </p>
            </div>



            <footer className="text-sm w-full bg-gray-800 text-white sm:text-2xl font-montserrat mb-2 text-center px-6 py-4">

                <p>&copy; {new Date().getFullYear()} Brainly Hub. All rights reserved.</p>

            </footer>




        </div>
  );
}
