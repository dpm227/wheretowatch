"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";

/* 
    Original NavBar from this tutorial
    https://www.youtube.com/watch?v=pxxthSFvXFA
*/

const Navbar = () => {
  const [isClick, setIsClick] = useState(false);

  const toggleNavbar = () => {
    setIsClick(!isClick);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0e0a84]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="shrink-0">
                <Link
                  href="/"
                  className="text-white hover:bg-white hover:text-black rounded-lg p-2"
                >
                  W2W
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <Link
                  href="/search"
                  className="text-white hover:bg-white hover:text-black rounded-lg p-2"
                >
                  Search
                </Link>
                <Link
                  href="/watchlist"
                  className="text-white hover:bg-white hover:text-black rounded-lg p-2"
                >
                  WatchList
                </Link>
                <Link
                  href="/adminwatchlist"
                  className="text-white hover:bg-white hover:text-black rounded-lg p-2"
                >
                  Admin
                </Link>
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-white
                          hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleNavbar}
              >
                {isClick ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {isClick && (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/search"
              className="text-white block hover:bg-white hover:text-black p-2"
            >
              Search
            </Link>
            <Link
              href="/watchlist"
              className="text-white block hover:bg-white hover:text-black p-2"
            >
              WatchList
            </Link>
            <Link
              href="/adminwatchlist"
              className="text-white block hover:bg-white hover:text-black p-2"
            >
              Admin
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
