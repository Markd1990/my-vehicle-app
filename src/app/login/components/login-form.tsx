"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    router.push("/users-profile");
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) setResetMsg(error.message);
    else setResetMsg("Password reset email sent. Check your inbox.");
  };

  return (
    <>
      {showReset ? (
        <form onSubmit={handleResetPassword} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="reset-email">Email</label>
          <Input
            id="reset-email"
            type="email"
            placeholder="Enter your email address"
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
            required
          />
          {resetMsg && <div className={resetMsg.startsWith('Password reset') ? "text-green-600 text-sm" : "text-red-500 text-sm"}>{resetMsg}</div>}
          <Button type="submit" className="w-full">Send Reset Link</Button>
          <button type="button" className="text-blue-600 hover:underline text-sm w-full text-center mt-2" onClick={() => setShowReset(false)}>
            Back to Login
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
            <form onSubmit={handleLogin} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="login-email">Email</label>
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <label className="block text-sm font-medium text-gray-700" htmlFor="login-password">Password</label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <button type="button" className="text-blue-600 hover:underline text-sm w-full text-center mt-2" onClick={() => setShowReset(true)}>
                Forgot password?
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
