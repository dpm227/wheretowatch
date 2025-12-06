"use client";
import Navbar from "../navbar";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

export default function AdminWatchList() {
  const { data: session, status } = useSession();
  const [allWatchlists, setAllWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllWatchlists() {
      //debug: log session info
      console.log("session status:", status);
      console.log("session user:", session?.user);
      console.log("user role:", session?.user?.role);

      if (status === "authenticated" && session?.user?.role === "ADMIN") {
        try {
          const res = await fetch("/api/watchlist/all");
          const data = await res.json();
          console.log("watchlist data:", data);
          setAllWatchlists(data);
        } catch (err) {
          console.error("error loading watchlists:", err);
        }
      }
      setLoading(false);
    }
    loadAllWatchlists();
  }, [session, status]);

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
          <h1 className="text-3xl font-bold mb-4">Admin Watchlists</h1>
          <p className="text-lg">Please log in to view this page.</p>
          <Link href="/">
            <Button variant="contained" sx={{ mt: 2 }}>
              Log In
            </Button>
          </Link>
        </div>
      </>
    );
  }

  if (session?.user?.role !== "ADMIN") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#232323] text-white flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg">You must be an admin to view this page.</p>
          <Link href="/watchlist">
            <Button variant="contained" sx={{ mt: 2 }}>
              Go to My Watchlist
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
        <h1 className="text-4xl font-bold mb-8 text-center">
          All Users Watchlists
        </h1>

        {allWatchlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <p className="text-xl">No watchlists found.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {allWatchlists.map((userWatchlist) => (
              <Accordion
                key={userWatchlist.userId}
                sx={{
                  backgroundColor: "#404040",
                  color: "white",
                  mb: 2,
                  borderRadius: "8px !important",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                  sx={{ borderRadius: "8px" }}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    {userWatchlist.userName || userWatchlist.username} (
                    {userWatchlist.movies.length} movies)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userWatchlist.movies.map((movie) => (
                      <Link key={movie.id} href={`/movie?id=${movie.movieId}`}>
                        <Card
                          sx={{
                            backgroundColor: "#333",
                            color: "white",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#555",
                            },
                          }}
                        >
                          <CardContent>
                            <Typography
                              sx={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {movie.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#aaa", mt: 1 }}
                            >
                              {movie.year || "Unknown year"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#888", mt: 0.5, fontSize: "0.75rem" }}
                            >
                              Added: {new Date(movie.createdAt).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
