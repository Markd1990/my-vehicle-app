'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LoginForm from "./login/components/login-form";
import SignupForm from "./login/components/signup-form";
 

export default function Home() {
  const [showAuth, setShowAuth] = React.useState<"login" | "signup" | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/next.svg" alt="App Logo" width={36} height={36} className="bg-white rounded" />
          <span className="text-xl font-bold text-[#1a6ed8]">My Vehicle App</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="ml-2" onClick={() => setShowAuth("login")}>Login</Button>
          <Button className="ml-2 bg-[#1a6ed8] text-white" onClick={() => setShowAuth("signup")}>Sign Up</Button>
        </div>
      </header>
      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowAuth(null)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-center">{showAuth === "login" ? "Login" : "Sign Up"}</h2>
            {showAuth === "login" ? <LoginForm /> : <SignupForm />}
            <div className="mt-4 text-center">
              {showAuth === "login" ? (
                <button className="text-blue-600 hover:underline text-sm" onClick={() => setShowAuth("signup")}>Don't have an account? Sign up</button>
              ) : (
                <button className="text-blue-600 hover:underline text-sm" onClick={() => setShowAuth("login")}>Already have an account? Login</button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold mb-8">This is the main page</h1>
        {/* You can add your main content/components here */}
      </main>
    </div>
  );
}
