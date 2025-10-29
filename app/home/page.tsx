"use client"

import AuthGuard from "../components/AuthGuard"

export default function Home(){
     return(

        <AuthGuard >
        <div>
            Welcome to Home
        </div>

        </AuthGuard>
     )
}