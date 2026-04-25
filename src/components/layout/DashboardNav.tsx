"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserCircle, MessageSquarePlus } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: UserCircle },
    { name: "New Request", href: "/requests/new", icon: MessageSquarePlus },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 mt-8">
      <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/5 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-white/10 text-white shadow-lg" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
