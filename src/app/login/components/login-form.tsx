"use client";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    // After successful login, check if profile exists, if not, create it
    const user = data.user;
    let redirectPath = "/profile";
    if (user) {
      const { data: profile, error: profileFetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();
      if (!profile) {
        // Try to get the role from user_metadata, fallback to 'client'
        let role = user.user_metadata?.role || "client";
        if (role === "rental-owner" || role === "rental_owner") role = "rentalowner";
        const { error: profileInsertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            user_email: user.email,
            role: role,
          },
        ]);
        if (profileInsertError) {
          setError(profileInsertError.message);
          setLoading(false);
          return;
        }
      }
      // Set redirect path based on role
      const role = user.user_metadata?.role;
      if (role === "client") {
        redirectPath = "/client/profile";
      } else if (role === "rentalowner" || role === "rental-owner" || role === "rental_owner") {
        redirectPath = "/owners-profile";
      }
    }
    router.push(redirectPath);
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
              <label className="block text-sm font-medium text-gray-700" htmlFor="login-password">Password</label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
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
