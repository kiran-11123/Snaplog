"use client"
import { Copy } from 'lucide-react';

interface Components {

    title: string,
    data: string,
    created_at: Date;


}


export default function Card({ title, data, created_at }: Components) {
    return (

        <div className="w-full max-w-md  bg-gray-200 h-96 p-4 shadow-xl rounded-md flex flex-col border items-center justify-between">

            <h1 className="text-center px-2 py-1 font-bold font-poppins text-lg">
                Docker Guide
            </h1>

            <div className="w-full h-72 overflow-auto custom-scrollbar bg-gray-500  rounded-lg shadow-lg text-white text-sm sm:text-md px-2 py-1">
                Imagine you are working on building a website that involves multiple tech stack like NodeJs, PostgreSQL, and Redis. And this all the thing install your local machine. and website is perfectly running on your local machine.

                Now suppose you want to share your website with your friend and you send him the github link and it clone that repo but there is one catch , your friend not have NodeJs, PostgreSQL, and Redis installed on his machine. So he is not able to run your website.

                So Docker solves this problems by install the all the dependencies of project in a single container. So you can share that container with your friend and he can run your website without installing anything on his machine.
                How Does Docker Work?
                Docker uses a technology called containers to package your application and its dependencies together. Containers are like lightweight virtual machines that can run anywhere, whether it's your laptop, a server, or the cloud. This means you can build your app on your computer and run it anywhere without worrying about differences in the environment.

                Benefits of Using Docker
                Consistency: Your app runs the same way everywhere, avoiding "it works on my machine" problems.
                Isolation: Each container is isolated, so different apps can run on the same machine without interfering with each other.
                Portability: You can easily move your app between different environments (development, testing, production) without changes.
                Efficiency: Containers are lightweight and start quickly, making them ideal for modern development practices like microservices and continuous integration/continuous deployment (CI/CD).
            </div>

            <div className='flex items-center justify-center w-full'>

                <div>25-10-2025</div>
               <Copy />

            </div>







        </div>

    )
}