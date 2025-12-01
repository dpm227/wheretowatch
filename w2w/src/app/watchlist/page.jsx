"use client";

import Navbar from "../navbar";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

export default function WatchList() {
  const { status } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);

  const loadWatchlist = async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      const res = await fetch("/api/watchlist");
      if (res.ok) {
        const json = await res.json();
        setItems(json);
      } else {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") {
      setItems([]);
    }
  }, [status]);

  const handleRemove = async (movieId) => {
    setActionId(movieId);
    try {
      await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });
      await loadWatchlist();
    } finally {
      setActionId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-[#232323] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-blue-100">
                Your List
              </p>
              <h1 className="text-4xl font-semibold mt-1">Watchlist</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/search">
                <Button
                  variant="contained"
                  startIcon={<PlaylistAddIcon />}
                  sx={{
                    backgroundColor: "white",
                    color: "#0e0a84",
                    fontWeight: 700,
                    "&:hover": { backgroundColor: "#f3f4f6" },
                  }}
                >
                  Add from Search
                </Button>
              </Link>
            </div>
          </div>

          {status !== "authenticated" && (
            <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-lg mb-4">
                Sign in with Auth0 to view and manage your watchlist.
              </p>
              <Button
                onClick={() => signIn("auth0", { callbackUrl: "/watchlist" })}
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "#0e0a84",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "#f3f4f6" },
                }}
              >
                Sign in
              </Button>
            </div>
          )}

          {status === "authenticated" && (
            <div className="mt-10">
              {loading ? (
                <p className="text-blue-100">Loading your watchlist...</p>
              ) : items.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <p className="text-lg mb-2">No movies yet.</p>
                  <p className="text-blue-100">
                    Browse and add movies from the Search page.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.movieId}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        <p className="text-sm uppercase tracking-wide text-blue-100">
                          {item.year || "Year unknown"}
                        </p>
                        <Link
                          href={`/movie?id=${item.movieId}`}
                          className="text-2xl font-semibold hover:text-blue-200"
                        >
                          {item.title}
                        </Link>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <Link
                          href={`/movie?id=${item.movieId}`}
                          className="text-blue-200 underline"
                        >
                          View
                        </Link>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemove(item.movieId)}
                          disabled={actionId === item.movieId}
                          sx={{
                            color: "#f87171",
                            borderColor: "rgba(248,113,113,0.5)",
                            "&:hover": {
                              borderColor: "#f87171",
                              backgroundColor: "rgba(248,113,113,0.1)",
                            },
                          }}
                        >
                          {actionId === item.movieId
                            ? "Removing..."
                            : "Remove"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
