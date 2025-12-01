"use client";
import Navbar from "../navbar";
import React from "react";
import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";

export default function Search() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res1 = await fetch(`/api/movies/`);
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
          <Link key={movie.id} href={`/movie?id=${movie.id}`}>
            <MovieCard key={movie.id} data={movie}></MovieCard>
          </Link>
        ))}
      </div>
    </>
  );
}
