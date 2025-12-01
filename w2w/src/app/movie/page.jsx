"use client";
import React from "react";
import Navbar from "../navbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useSearchParams } from "next/navigation";
import { WatchmodeClient } from "@watchmode/api-client";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useSession, signIn } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress";

export default function MovieCard() {
  const [data, setData] = useState(null);
  const [movie, setMovie] = useState(null);
  const params = useSearchParams();
  const id = params.get("id");
  const client = new WatchmodeClient({
    apiKey: "SzuxHRuzsNZvEVlauBHWENPpznNerHfWzwxBh45P",
  });
  const [sources, setSources] = useState([]);
  const { status, data: session } = useSession();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isUpdatingWatchlist, setIsUpdatingWatchlist] = useState(false);
  const [checkingWatchlist, setCheckingWatchlist] = useState(false);

  useEffect(() => {
    async function load() {
      const res1 = await fetch(`/api/movies/${id}`);
      const rows = await res1.json();
      const movieRow = rows[0];
      setData(movieRow);

      const { data: sources } = await client.title.getSources(movieRow.wmId, {
        regions: "US",
      });

      const uniqueSources = Object.values(
        sources.reduce((acc, src) => {
          acc[src.name] = src;
          return acc;
        }, {})
      );

      setSources(uniqueSources);

      console.log(sources);
      const imdbId = movieRow.imdbId;

      if (!imdbId) {
        console.warn("No imdbId found:", id);
        return;
      }

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
      //console.log(movieData);
      setMovie(movieData);
    }

    load();
  }, [id]);

  useEffect(() => {
    const fetchWatchlistState = async () => {
      if (!id || status !== "authenticated") {
        setIsInWatchlist(false);
        return;
      }
      setCheckingWatchlist(true);
      try {
        const res = await fetch(`/api/watchlist?movieId=${id}`);
        if (res.ok) {
          const json = await res.json();
          setIsInWatchlist(Boolean(json.inWatchlist));
        }
      } finally {
        setCheckingWatchlist(false);
      }
    };

    fetchWatchlistState();
  }, [id, status]);

  const handleToggleWatchlist = async () => {
    if (status !== "authenticated") {
      signIn("auth0", { callbackUrl: `/movie?id=${id}` });
      return;
    }
    setIsUpdatingWatchlist(true);
    try {
      const method = isInWatchlist ? "DELETE" : "POST";
      const res = await fetch("/api/watchlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: Number(id) }),
      });
      if (res.ok) {
        setIsInWatchlist(!isInWatchlist);
      }
    } finally {
      setIsUpdatingWatchlist(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] w-full bg-[#232323] text-white flex justify-center items-center">
        {" "}
        <div className="flex max-w-5xl w-full gap-10 items-center">
          {" "}
          <div className="w-1/2 flex justify-center items-center p-4">
            <Card
              sx={{
                width: 345,
                backgroundColor: "#404040",
                color: "white",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardActionArea
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={
                    movie?.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://placehold.co/500x750?text=No+Image"
                  }
                  alt={movie?.title}
                />
              </CardActionArea>
            </Card>
          </div>
          <div className="w-1/2 flex flex-col p-4">
            <h1 className="font-bold text-5xl mb-4">{movie?.title}</h1>
            <p className="text-lg mb-4">{movie?.overview}</p>
            <Button
              className="mt-4"
              variant="outlined"
              startIcon={<FormatListBulletedIcon />}
              onClick={handleToggleWatchlist}
              disabled={checkingWatchlist || isUpdatingWatchlist}
            >
              {status !== "authenticated"
                ? "Sign in to save"
                : checkingWatchlist
                  ? "Checking..."
                  : isUpdatingWatchlist
                    ? isInWatchlist
                      ? "Removing..."
                      : "Adding..."
                    : isInWatchlist
                      ? "Remove from Watchlist"
                      : "Add to Watchlist"}
            </Button>
            {checkingWatchlist && (
              <div className="mt-2 text-sm flex items-center gap-2 text-gray-300">
                <CircularProgress size={14} color="inherit" />
                Checking watchlist...
              </div>
            )}
            <h3 className="font-bold text-3xl mb-4 mt-4">Where to Watch:</h3>
            <div className="mt-4 flex gap-3 flex-wrap">
              {sources.length === 0 && <p>No streaming sources found.</p>}

              {sources.map((src, i) => (
                <div key={i}>
                  <a
                    href={src.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {src.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
