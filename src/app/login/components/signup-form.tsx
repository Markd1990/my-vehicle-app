"use client";
import { useState } from "react";
 
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function SignupForm({ onShowLoginAction }: { onShowLoginAction?: () => void } = {}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Do NOT insert into profiles here (RLS will block it)
    setSuccess("Check your email to confirm your account.");
    setLoading(false);
    setEmail("");
    setPassword("");
    // Optionally, you can toast here as well
    toast("Signup successful 🎉", {
      description: "Check your email for a confirmation link.",
      duration: 2000,
    });
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
      <div className="relative">
        <Input
          id="signup-password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          value={password}
          onChange={e => setPassword(e.target.value)}
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
      <label className="block text-sm font-medium text-gray-700" htmlFor="signup-role">Role</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between mb-2"
            type="button"
          >
            {role === "Choose Role" ? "Select a role" : role.charAt(0).toUpperCase() + role.slice(1).replace("-", " ")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuItem onSelect={() => setRole("client")}>Client</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setRole("rental_owner")}>Rental Owner</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
