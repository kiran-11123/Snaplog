"use client"
import { useState  } from "react"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signin(){

    const [email , setEmail ] = useState('');
    const [Password , setPassword] = useState('')
    const [message , setMessage] = useState('');

    const router = useRouter();


    async function SubmitForm(e:any) {

        e.preventDefault();

        try{

            const response  = await axios.post("http://localhost:5000/api/v1/users/signin", {
                email,
                Password
            } ,{
                withCredentials:true
            })

            if(response.status===200){
                
                localStorage.setItem("token" , response.data.token);
                setMessage("Login Successfull...")

                setTimeout(()=>{
                   setMessage('');
                   setEmail('')
                   setPassword('');
                },2000)
                
                router.replace("/home")
 
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
              
            }, 3000)
        }
        
    }
     
    return(
       <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">

            <div className="w-full max-w-md  sm:max-w-lg rounded-lg px-8 shadow-2xl bg-white">

                <h1 className="font-bold  text-blue-700 text-center text-lg sm:text-xl mb-6 mt-5">Login Here</h1>

                <form className="space-y-5" onSubmit={SubmitForm}>

                    <div>
                        <label className="font-bold text-lg sm:text-xl block mb-1">
                            Email
                        </label>

                        <input onChange={(e) => setEmail(e.target.value)} required value={email} className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Enter your Email" type="email" />
                    </div>


                    <div>
                        <label className="font-bold text-lg sm:text-xl block mb-1">
                            Password
                        </label>

                        <input required onChange={(e) => setPassword(e.target.value)} value={Password} className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Enter your Password" type="Password" />
                    </div>


                    <button className="text-center transition duration-300 cursor-pointer hover:bg-blue-800 font-bold hover:border hover:border-gray-300 shadow-lg  text-lg sm:xl  w-full rounded-lg bg-blue-500 text-white mb-5 px-3 py-2">
                        Login
                    </button>

                </form>

                <div className="w-full mb-10 flex  flex-col items-center justify-between text-center mt-3 ">

                    <p className="text-sm sm:text-lg text-gray-600  ">
                        Don’t have an account?{' '}
                        <Link href="/signup" className="text-blue-500  hover:underline cursor-pointer">
                            Sign up
                        </Link>
                    </p>
                    <p className="text-sm sm:text-lg text-gray-600 px-6 py-2 shadow-lg rounded-lg">
                        <Link href="/forgetpassword" className="text-blue-500 hover:underline cursor-pointer" >Forget password</Link>
                    </p>

                </div>


                {message && (

                    <p className="font-black text-center text-md sm:text-lg mb-10">{message}</p>
                )}

            </div>

        </div>
    )
}