"use client";

import Navbar from "../navbar";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function UsersPage() {
  const { status } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to load users");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadUsers();
    }
  }, [status]);

  const isUnauthed = status !== "authenticated";

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-[#232323] text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-blue-100">
              Admin
            </p>
            <h1 className="text-4xl font-semibold mt-1">Users</h1>
          </div>

          {isUnauthed && (
            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-lg mb-4">
                Sign in as an admin to view users.
              </p>
              <button
                onClick={() => signIn("auth0", { callbackUrl: "/users" })}
                className="rounded-full bg-white text-[#0e0a84] px-6 py-3 font-semibold shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Sign in
              </button>
            </div>
          )}

          {status === "authenticated" && (
            <div className="mt-8">
              {loading && (
                <p className="text-blue-100">Loading users...</p>
              )}
              {error && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-100 rounded-2xl p-4">
                  {error}
                </div>
              )}
              {!loading && !error && users.length === 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p>No users found.</p>
                </div>
              )}
              {!loading && !error && users.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {users.map((user) => (
                    <div
                      key={user.authId}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">{user.name || "User"}</p>
                        {user.isAdmin && (
                          <span className="text-xs px-2 py-1 rounded-full bg-white text-[#0e0a84] font-semibold">
                            Admin
                          </span>
                        )}
                      </div>
                      {user.email && (
                        <p className="text-sm text-blue-100">{user.email}</p>
                      )}
                      <p className="text-sm text-blue-100">
                        Watchlist items: {user.watchlistCount || 0}
                      </p>
                      <p className="text-xs text-blue-200 break-all">
                        Auth ID: {user.authId}
                      </p>
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
