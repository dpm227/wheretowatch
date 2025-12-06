"use client";
import React from "react";
import Navbar from "../navbar";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import { useSearchParams } from "next/navigation";
import { WatchmodeClient } from "@watchmode/api-client";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CheckIcon from "@mui/icons-material/Check";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MoviePage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [movie, setMovie] = useState(null);
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);
  const [watchlistMessage, setWatchlistMessage] = useState("");
  const params = useSearchParams();
  const id = params.get("id");
  const client = new WatchmodeClient({
    apiKey: "SzuxHRuzsNZvEVlauBHWENPpznNerHfWzwxBh45P",
  });
  const [sources, setSources] = useState([]);

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
      setMovie(movieData);
    }

    load();
  }, [id]);

  //handle adding movie to watchlist
  const handleAddToWatchlist = async () => {
    if (status !== "authenticated") {
      setWatchlistMessage("Please log in to add to watchlist");
      return;
    }

    try {
      const res = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          movieId: parseInt(id),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setAddedToWatchlist(true);
        setWatchlistMessage("Added to watchlist!");
      } else if (res.status === 409) {
        setWatchlistMessage("Already in your watchlist");
      } else {
        setWatchlistMessage(result.error || "Failed to add");
      }
    } catch (err) {
      console.error("error adding to watchlist:", err);
      setWatchlistMessage("Error adding to watchlist");
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

            {status === "authenticated" ? (
              <Button
                className="mt-4"
                variant={addedToWatchlist ? "contained" : "outlined"}
                color={addedToWatchlist ? "success" : "primary"}
                startIcon={addedToWatchlist ? <CheckIcon /> : <FormatListBulletedIcon />}
                onClick={handleAddToWatchlist}
                disabled={addedToWatchlist}
              >
                {addedToWatchlist ? "Added to Watchlist" : "Add To Watchlist"}
              </Button>
            ) : (
              <Link href="/login">
                <Button
                  className="mt-4"
                  variant="outlined"
                  startIcon={<FormatListBulletedIcon />}
                >
                  Log in to Add to Watchlist
                </Button>
              </Link>
            )}

            {watchlistMessage && (
              <p className="mt-2 text-sm text-gray-300">{watchlistMessage}</p>
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
