"use client";
import Navbar from "../navbar";
import React from "react";
import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";

export default function Search() {
  const [data, setData] = useState(null);

  const appendDataItem = (json) => {
    setData((prevData) => [...prevData, ...json.results]);
  };

  useEffect(() => {
    async function load() {
      const res1 = await fetch("/api/movies");
      const movieList = await res1.json();
      setData(movieList);
    }
    load();
  }, []);

  return (
    <>
      <Navbar />
      <div className="py-3 px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 place-items-center bg-[#232323] text-white">
        {data?.map((movie) => (
          <MovieCard key={movie.id} data={movie}></MovieCard>
        ))}
      </div>
    </>
  );
}
