"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import AIAssistant from "@/components/AIAssistant";
import { cn } from "@/lib/utils";

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes where we DON'T want the sidebar and topnav
  const hideNavRoutes = ["/", "/login", "/register"];
  const isHideNav = hideNavRoutes.includes(pathname);

  if (isHideNav) {
    return (
      <div className="min-h-screen bg-slate-950">
        {children}
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 min-h-screen relative flex flex-col">
        <TopNav />
        <div className="flex-1 w-full">
          {children}
        </div>
      </main>
      <AIAssistant />
    </div>
  );
}
