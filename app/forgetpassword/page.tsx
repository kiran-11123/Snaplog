
"use client"
import { useState } from "react"
import axios from "axios"
export default function forgetpassword() {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const [code, SetCode] = useState('');

    const [Password, SetPassword] = useState('');
    const [Password1, SetPassword1] = useState('');

    const [state, SetState] = useState(1);

    async function CodeSubmit(e: any) {

        e.preventDefault();

        try {


            const response = await axios.post("https://snaplog-6.onrender.com/api/v1/users/verify-code", {

                email: email,
                code: code,

            })


            if (response.status === 200) {

                SetState(3)
                setMessage(response.data.message);


                setTimeout(() => {

                    setEmail('');
                    SetCode('');
                }, 1000)

                setTimeout(() => {

                    setMessage('')
                }, 3000)
            }
            else {

                setMessage(response.data.message);


                setTimeout(() => {

                    setEmail('');
                    SetCode('');
                }, 1000)

                setTimeout(() => {

                    setMessage('')
                }, 3000)
            }
        }
        catch (er) {
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
            }, 3000)
        }


    }

    /* ------------------------------------------------------------------------------------------------------------------------- */
    async function ResetPassword(e: any) {
        e.preventDefault();


        try {



            const response = await axios.post("https://snaplog-6.onrender.com/api/v1/users/resetpassword", {
                email: email,
            }, {
                withCredentials: true
            })


            if (response.status === 200) {
                setMessage(response.data.message);

                SetState(2);

                setTimeout(() => {

                    setEmail('')
                }, 1000)

                setTimeout(() => {

                    setMessage('')
                }, 3000)
            }
            else {
                setMessage(response.data.message);

                setTimeout(() => {
                    setMessage('')
                    setEmail('')
                }, 3000)
            }


        }
        catch (er) {

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
            }, 3000)

        }



    }

    /* ------------------------------------------------------------------------------------------------------------------------- */

    async function PasswordReset(e: any) {

        e.preventDefault();
        try {

            
            if(Password !== Password1){
                setMessage("Passwords Didn't Match")
                SetState(3);
                return;
            }

            
            if(Password.length <5){
                SetState(3);
                setMessage("Password length must be more than 5 characters")
                return;
            }


            const response = await axios.put("https://snaplog-6.onrender.com/api/v1/users/resetPassword"  ,{
                email:email,
                Password : Password ,
            },{
                withCredentials:true
            })


            if(response.status===200){
                 
                SetState(1);

                setMessage(response.data.message);

                setTimeout(() => {

                    setEmail('')
                }, 1000)

                setTimeout(() => {

                    setMessage('')
                }, 3000)

                
            }
            else{
                 setMessage(response.data.message);

                setTimeout(() => {

                    setEmail('')
                }, 1000)

                setTimeout(() => {

                    setMessage('')
                }, 3000)

            }

        }
        catch (er) {
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
            }, 3000)
        }

    }

    /* ------------------------------------------------------------------------------------------------------------------------- */

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">

            {state === 1 && (<div className="w-full  max-w-xl bg-white shadow-lg rounded-lg sm:max-w-lg px-8 ">

                <h1 className="text-lg sm:text-xl text-center text-blue-800 mt-5">Forget Password </h1>

                <form onSubmit={ResetPassword}>

                    <div>
                        <label className="font-bold text-lg sm:text-xl block mb-1">
                            Email
                        </label>

                        <input onChange={(e) => setEmail(e.target.value)} required value={email} className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Enter your Email" type="email" />
                    </div>

                    <button className="text-center  mt-10 transition duration-300 hover:bg-blue-800 font-bold hover:border hover:border-gray-300 shadow-lg  text-lg sm:xl  w-full rounded-lg bg-blue-500 text-white mb-5 px-3 py-2">
                        Submit
                    </button>

                     {message ? <p className="text-center text-red-500 text-xl  font-bold mb-5">{message}</p> : null}

                </form>

               

            </div>)}


            {state === 2 && (

                <div className="w-full  max-w-xl bg-white shadow-lg rounded-lg sm:max-w-lg px-8 ">

                    <h1 className="text-lg sm:text-xl text-center text-blue-800 mt-5">Enter Code </h1>

                    <form onSubmit={CodeSubmit}>
                        <div>
                            <label className="font-bold text-lg sm:text-xl block mb-1">
                                Email
                            </label>

                            <input onChange={(e) => setEmail(e.target.value)} required value={email} className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Enter your Email" type="email" />
                        </div>

                        <div>
                            <label className="font-bold text-lg sm:text-xl block mb-1">
                                Code
                            </label>

                            <input onChange={(e) => SetCode(e.target.value)} required value={code} className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Enter your code"  />
                        </div>

                        <button className="text-center  mt-10 transition duration-300 hover:bg-blue-800 font-bold hover:border hover:border-gray-300 shadow-lg  text-lg sm:xl  w-full rounded-lg bg-blue-500 text-white mb-5 px-3 py-2">
                            Submit
                        </button>

                         {message ? <p className="text-center text-red-500 text-xl  font-bold mb-5">{message}</p> : null}

                    </form>


                </div>
            )}


            {state === 3 && (

                <div className="w-full  max-w-xl bg-white shadow-lg rounded-lg sm:max-w-lg px-8 ">

                    <h1 className="text-lg sm:text-xl text-center text-blue-800 mt-5">Enter Password </h1>

                    <form onSubmit={PasswordReset}>

                         <div>
                        <label className="font-bold text-lg sm:text-xl block mb-1">
                            Email
                        </label>

                        <input onChange={(e) => setEmail(e.target.value)} required value={email} className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Enter your Email" type="email" />
                    </div>

                        <div>
                            <label className="font-bold text-lg sm:text-xl block mb-1">
                                Enter Password
                            </label>

                            <input onChange={(e) => SetPassword(e.target.value)} required value={Password} className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Password" type="Password" />
                        </div>


                        <div>
                            <label className="font-bold text-lg sm:text-xl block mb-1">
                                ReEnter Password
                            </label>

                            <input onChange={(e) => SetPassword1(e.target.value)} required value={Password1} className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="ReEnter Password" type="Password" />
                        </div>

                        <button className="text-center  mt-10 transition duration-300 hover:bg-blue-800 font-bold hover:border hover:border-gray-300 shadow-lg  text-lg sm:xl  w-full rounded-lg bg-blue-500 text-white mb-5 px-3 py-2">
                            Submit
                        </button>

                        {message ? <p className="text-center text-red-500 text-xl  font-bold mb-5">{message}</p> : null}

                    </form>

                    

                </div>
            )}


        </div>
    )
}