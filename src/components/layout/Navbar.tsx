"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) return null;

  const navLinks = [
    { name: "Features", href: "#" },
    { name: "Courses", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Resources", href: "#" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              SkillBridge
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">Profile</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="premium" size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-muted-foreground p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass border-b border-white/5 absolute top-16 left-0 w-full p-4 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-muted-foreground py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">Dashboard</Button>
                  </Link>
                  <Button 
                    variant="premium" 
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button variant="premium" className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
