"use client";
 
 import { usePathname } from "next/navigation";
 import { cn } from "@/lib/utils";
 
 export function MainContent({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const isMeetingPage = pathname?.startsWith("/session/");
 
   return (
     <main className={cn("flex-1", !isMeetingPage && "pt-16")}>
       {children}
     </main>
   );
 }
