"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      const res = await registerUser(formData);
      
      if (res.error) {
        alert(res.error);
        return;
      }

      // Automatically sign in after signup
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/onboarding",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-8 glass rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 premium-gradient" />
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl premium-gradient mb-4 text-white">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join the SkillBridge student community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">College Email</label>
            <input
              type="email"
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" variant="premium" className="w-full mt-4" size="lg" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Start Learning"} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
        </div>

        <Button 
          variant="outline" 
          className="w-full gap-2" 
          size="lg"
          onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
