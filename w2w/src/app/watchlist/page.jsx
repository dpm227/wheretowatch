"use client";
import Navbar from "../navbar";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

//component to display a single movie card with poster
function WatchlistMovieCard({ item, onRemove }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function loadPoster() {
      const imdbId = item.imdbId;
      if (!imdbId) return;

      const res = await fetch(
        `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGZjZmNiMzVlNTBlNmRmMDAwZDFiODQzMzRmZTIzMCIsIm5iZiI6MTc2MzcwNzA3MC45NTI5OTk4LCJzdWIiOiI2OTIwMDhiZWJlYTU4ODRlZmVhZGMwZDMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.C41FkuGV7QFMhYYxYTQzHF8LEImzQZJ0mjOMVexsgHc",
          },
        }
      );
      const json = await res.json();
      const movieData = json.movie_results?.[0] || null;
      setMovie(movieData);
    }
    loadPoster();
  }, [item.imdbId]);

  return (
    <Card
      sx={{
        width: 280,
        backgroundColor: "#404040",
        color: "white",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link href={`/movie?id=${item.movieId}`}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="200"
            image={
              movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://placehold.co/500x750?text=No+Image"
            }
            alt={item.title}
            sx={{ height: 350, objectFit: "cover" }}
          />
          <CardContent>
            <Typography
              gutterBottom
              component="div"
              sx={{
                height: "48px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              {item.year || "Unknown year"}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => onRemove(item.movieId)}
        sx={{ m: 1 }}
      >
        Remove
      </Button>
    </Card>
  );
}

export default function WatchList() {
  const { data: session, status } = useSession();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWatchlist() {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const res = await fetch(`/api/watchlist/${session.user.id}`);
          const data = await res.json();
          setWatchlist(data);
        } catch (err) {
          console.error("error loading watchlist:", err);
        }
      }
      setLoading(false);
    }
    loadWatchlist();
  }, [session, status]);

  const handleRemove = async (movieId) => {
    try {
      const res = await fetch("/api/watchlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, movieId }),
      });

      if (res.ok) {
        setWatchlist(watchlist.filter((item) => item.movieId !== movieId));
      }
    } catch (err) {
      console.error("error removing from watchlist:", err);
    }
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#232323] text-white flex justify-center items-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#232323] text-white flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4">My Watchlist</h1>
          <p className="text-lg">Please log in to view your watchlist.</p>
          <Link href="/">
            <Button variant="contained" sx={{ mt: 2 }}>
              Log In
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#232323] text-white p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">My Watchlist</h1>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <p className="text-xl mb-4">Your watchlist is empty.</p>
            <Link href="/search">
              <Button variant="contained">Browse Movies</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
            {watchlist.map((item) => (
              <WatchlistMovieCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
