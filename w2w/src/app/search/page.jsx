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
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const res1 = await fetch(`/api/movies/title/christmas`);
      const movieList = await res1.json();
      setData(movieList);
    }
    load();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/movies/title/${search}`);
    const movieList = await res.json();
    setData(movieList);
  };

  return (
    <>
      <Navbar />
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          p: "20px 4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#232323",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: 400,
            backgroundColor: "transparent",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "8px",
            backdropFilter: "blur(4px)",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, color: "white" }}
            placeholder="Search for a movie"
            inputProps={{ "aria-label": "search for a movie" }}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <IconButton
            type="submit"
            sx={{ p: "10px", color: "white" }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
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
