"use client";
import Navbar from "../navbar";
import React from "react";
import { useState, useEffect } from "react";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";


export default function Home() {
  return (
    <>
      <Navbar />
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "40px",
          padding: "40px",
        }}
      >
        <div style={{ flex: 1 }}>
          <Login />
        </div>

        <div style={{ flex: 1 }}>
          <SignUp />
        </div>
      </div>

    </>
  );
}
