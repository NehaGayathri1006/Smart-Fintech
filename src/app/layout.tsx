import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AIAssistant from "@/components/AIAssistant";
import TopNav from "@/components/TopNav";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Fintech Tracker | AI-Powered Finance",
  description: "Track your expenses, manage budgets, and get AI-driven financial insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50`}>
        <Providers>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen relative flex flex-col">
              <TopNav />
              <div className="flex-1 w-full">
                {children}
              </div>
            </main>
          </div>
          <AIAssistant />
        </Providers>
      </body>
    </html>
  );
}
