"use client"
import { useState } from "react"
import Link from "next/link";
import axios from "axios";
export default function signup(){

    const[email , setEmail ] = useState('');
    const [Password , setPassword] = useState('');
    const [username , setUsername] = useState('');
    const [message , setMessage] = useState('');


    async function  submitForm(e:any) {

        e.preventDefault();

        try{

            if(!email || !username || !Password){
                setMessage("All fields are required");
                return;
            }

            if(Password.length <5){
                setMessage("Password length must be more than 5 characters")
                return;
            }

            const response = await axios.post("http://localhost:5000/api/v1/users/signup" ,{
                email,
                username,
                Password,
            },{
                withCredentials:true
            })

            if(response.status===201){
                 setMessage(response.data.message);

                 setTimeout(()=>{

                    setMessage('');
                    setEmail('');
                    setPassword('');
                    setUsername('');

                 },2000)
            }
            else{

                setMessage(response.data.message);
            }

        }
        catch(er){
            if (typeof er === "object" && er !== null && "response" in er) {
                const error = er as any;
                if (error.response && error.response.data && error.response.data.message) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('error in login');
                }
            } else {
                setMessage('error in login');
            }


            setTimeout(() => {
                setMessage('')
                setEmail('')
                setPassword('')
                setUsername('')
            }, 3000)
        }
        
    }
       
    return(
        
        <div className="flex flex-col items-center py-20 bg-gray-50 px-4  font-poppins">

            <div className="w-full max-w-md sm:max-w-lg rounded-lg shadow-2xl bg-white px-8 ">

                <h1 className="font-bold  text-blue-700 text-center text-lg sm:text-xl mb-6 mt-5">Register Here</h1>

                <form className="space-y-5" onSubmit={submitForm}>

                    <div>
                        <label className="font-bold text-lg sm:text-xl block mb-1">
                            Email
                        </label>

                        <input onChange={(e) => setEmail(e.target.value)} value={email} required className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Enter your Email" type="email" />
                    </div>

                    <div>
                        <label className="font-bold text-lg sm:text-xl block mb-1">
                            Username
                        </label>

                        <input onChange={(e) => setUsername(e.target.value)} value={username} required className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Enter Username" type="text" />
                    </div>



                    <div>
                        <label className="font-bold text-lg sm:text-xl block mb-1">
                            Password
                        </label>

                        <input onChange={(e) => setPassword(e.target.value)} value={Password} required className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Enter your Password" type="Password" />
                    </div>




                    <button className="text-center hover:bg-blue-800 hover:border shadow-2xl hover:border-gray-300 transition duration-300 font-bold text-lg sm:xl  w-full rounded-lg bg-blue-500 text-white mb-3 px-3 py-2">
                        Register
                    </button>

                </form>

                <div className="w-full mb-5 items-center justify-center text-center mt-3 py-5">

                    <p className="text-sm sm:text-lg text-gray-600 ">
                        Back to Login?{' '}
                        <Link href="/signin" className="text-blue-500 hover:underline cursor-pointer">
                            Sign In
                        </Link>
                    </p>

                </div>



                {message && (

                    <p className="font-black text-center text-md sm:text-lg mb-10">{message}</p>
                )}

            </div>

        </div>
    )
}