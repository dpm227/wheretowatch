"use client";
import Navbar from "../navbar";
import React, { useState } from "react";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import { useSession } from "next-auth/react";
import Button from "@mui/material/Button";
import { signOut } from "next-auth/react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [showSignUp, setShowSignUp] = useState(false);

  //if user is already logged in, show their info and logout option
  if (status === "authenticated") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#232323] text-white flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4">Welcome, {session.user.username}!</h1>
          <p className="text-lg mb-2">Role: {session.user.role}</p>
          <Button
            variant="contained"
            color="error"
            onClick={() => signOut()}
            sx={{ mt: 2 }}
          >
            Log Out
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#232323] text-white flex flex-col justify-center items-center p-4">
        <div className="mb-4">
          <Button
            variant={!showSignUp ? "contained" : "outlined"}
            onClick={() => setShowSignUp(false)}
            sx={{ mr: 2 }}
          >
            Login
          </Button>
          <Button
            variant={showSignUp ? "contained" : "outlined"}
            onClick={() => setShowSignUp(true)}
          >
            Sign Up
          </Button>
        </div>

        <div className="bg-[#404040] p-6 rounded-lg">
          {showSignUp ? <SignUp /> : <Login />}
        </div>
      </div>
    </>
  );
}

