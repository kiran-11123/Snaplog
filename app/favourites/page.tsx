"use client"
import { responsiveFontSizes } from "@mui/material";
import axios from "axios";
import { useState ,useEffect } from "react"
import Card from "../components/Card";



interface Components {
    _id:string,
    workspace_name: string | null,
    title: string,
    data: string,
    favourite:boolean,
    createdAt: Date;
    disabled?: boolean;


}

export default function Favourites(){
    
    const[favourites,setFavourites] = useState([]);
    const[message,setMessage] = useState('');


    useEffect(()=>{
             
       async function GetFavourites() {

            try{
                            

                const response =await axios.post("https://snaplog-6.onrender.com/api/v1/favourites_data/get_favourites" , {
                    
                },{
                    withCredentials:true
                })

                if(response.status === 201){
                     
                    setFavourites(response.data.favourites);
                    setMessage(response.data.message);
                }
                else{
                    setMessage(response.data.message);
                }

            }
            catch(er){
                 
                setMessage('Error while fetching the data...')
            }
        
       }

       GetFavourites();

    } ,[])

       
    return(
        <div className="flex flex-col w-full justify-between bg-gray-100">

            <div className="flex justify-between items-center mt-2  w-full text-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#44403c] via-[#78716c] to-[#d6d3d1] rounded-md px-6 py-4 font-bold shadow-xl ">
                        
                <h1 className="font-serif hover:bg-gray-300 cursor-pointer px-4 py-2 rounded-lg shadow-2xl bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#27272a] via-[#52525b] to-[#a1a1aa] text-xl">Favourites</h1>

            </div>


             <div className="grid grid-cols-1 sm:grid-cols-2 p-4 justify-center items-center md:grid-cols-3 gap-6 mt-5">
                        {favourites && favourites.length > 0 ? (
                         favourites.map((item : Components) => (
                          <div
                            key={item._id}
                            className="transition-all flex border items-center max-w-md justify-center duration-300 ease-in-out hover:outline hover:outline-2 hover:outline-blue-300 hover:border hover:border-blue-400 hover:shadow-xl hover:shadow-gray-300/50 rounded-l"
                          >  
                        
                            <Card
                key={item._id}
                id={item._id}
                workspace_name={"default"}
                title={item.title}
                data={item.data}
                created_at={item.createdAt}
                favourite={item.favourite}
                disabled={true}
              />
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-lg sm:text-xl font-semibold col-span-full font-poppins ">
                          Favourites Empty !!!
                        </p>
                      )}
                    </div>
             
        </div>
    )
}