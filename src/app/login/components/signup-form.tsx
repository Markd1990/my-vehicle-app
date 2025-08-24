"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Insert into profiles table if signup succeeded
    const user = data.user || data.session?.user;
    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email,
          role: "client",
        },
      ]);
      if (profileError) setError(profileError.message);
      // Show login form after successful signup
      setSuccess("");
      setLoading(false);
      // Optionally, clear fields
      setEmail("");
      setPassword("");
      // You can use a callback/prop or global state to show the login form modal if needed
      // For now, just display a message
      toast("Signup successful 🎉", {
        description: "You can now log in with your new account.",
        duration: 5000,
      });
      return;
    }
    setSuccess("Check your email to confirm your account.");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-2">
      <label className="block text-sm font-medium text-gray-700" htmlFor="signup-email">Email</label>
      <Input
        id="signup-email"
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <label className="block text-sm font-medium text-gray-700" htmlFor="signup-password">Password</label>
      <Input
        id="signup-password"
        type="password"
        placeholder="Create a password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
      <div className="text-xs text-gray-500 text-center mt-2">
        A magic link will be sent to your email for confirmation.
      </div>
    </form>
  );
}
