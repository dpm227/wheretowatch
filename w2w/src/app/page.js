"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Navbar from "./navbar";

export default function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <>
      <Navbar />
      <main className="relative min-h-[calc(100vh-4rem)] bg-[#232323] text-white flex items-center justify-center px-6 py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-6 bottom-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="relative z-10 w-full max-w-3xl text-center">
          <div className="bg-white/5 border border-white/15 rounded-3xl p-10 backdrop-blur-xl shadow-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-100">
              Where to Watch
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold leading-tight">
              Sign in with Auth0
            </h1>
            <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
              Keep your watchlist synced across devices and jump back into your
              picks instantly with a secure Auth0 login.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              {session ? (
                <>
                  <div className="text-lg font-medium">
                    Signed in as{" "}
                    {session.user?.name || session.user?.email || "viewer"}
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="rounded-full bg-white text-[#0e0a84] px-6 py-3 font-semibold shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      Sign out
                    </button>
                    <span className="rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm text-blue-100">
                      Ready to continue browsing
                    </span>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => signIn("auth0", { callbackUrl: "/search" })}
                  className="rounded-full bg-white text-[#0e0a84] px-8 py-3 font-semibold shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Sign in with Auth0
                </button>
              )}

              {isLoading && (
                <p className="text-sm text-blue-100">Checking session…</p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              {[
                { title: "Secure by Auth0", text: "Managed login, MFA-ready, and hardened identity flows." },
                { title: "Stay in Sync", text: "Keep your watchlist tied to your profile wherever you sign in." },
                { title: "Jump In Fast", text: "Head straight to Search after signing in and keep browsing." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg"
                >
                  <p className="text-sm uppercase tracking-wide text-blue-100">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-white/90">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
