'use client';

import { useEffect, useState } from "react";
import DeleteCard from "./RecentlyDeleted";

interface Components {
  _id: string;
  workspace_name: string | null;
  title: string;
  data: string;
  createdAt: Date;
}

interface Props {
  title: string;
}

export default function RecentlyDeletedClient({ title }: Props) {
  const [data, setData] = useState<Components[]>([]);

  useEffect(() => {
    async function fetchRecentlyDeleted() {
      try {
        const res = await fetch("http://localhost:5000/api/v1/delete/recently_deleted", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workspace_name: title }),
          credentials: "include", // if needed
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchRecentlyDeleted();
  }, [title]);

  return (
    <div className="bg-gray-100 flex flex-col justify-between w-full">
      <div className="flex justify-between items-center mt-2 w-full text-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#44403c] via-[#78716c] to-[#d6d3d1] rounded-md px-6 py-4 font-bold shadow-xl">
        <h1 className="hidden sm:block font-serif px-4 py-2 rounded-lg shadow-2xl bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#27272a] via-[#52525b] to-[#a1a1aa] text-lg text-blue-800">
          Recently Deleted: {title}
        </h1>
        <h1 className="sm:hidden font-serif px-4 py-2 rounded-lg shadow-2xl bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#27272a] via-[#52525b] to-[#a1a1aa] text-lg text-blue-800">
          {title}
        </h1>
        <p className="text-sm hidden md:block">
          Items in "Recently deleted" will be kept for only 7 days before being permanently deleted
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4 gap-6 mt-5 justify-center items-center">
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item._id}
              className="transition-all flex border items-center max-w-md justify-center duration-300 ease-in-out hover:outline hover:outline-2 hover:outline-blue-300 hover:border hover:border-blue-400 hover:shadow-xl hover:shadow-gray-300/50 rounded-l"
            >
              <DeleteCard
                id={item._id}
                workspace_name={title}
                title={item.title}
                data={item.data}
                created_at={item.createdAt}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-lg sm:text-xl font-semibold col-span-full font-poppins">
            Bin is Empty
          </p>
        )}
      </div>
    </div>
  );
}
