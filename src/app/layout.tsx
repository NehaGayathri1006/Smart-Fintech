import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Fintech Tracker | AI-Powered Finance",
  description: "Track your expenses, manage budgets, and get AI-driven financial insights.",
};

import NavigationWrapper from "@/components/NavigationWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50`}>
        <Providers>
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </Providers>
      </body>
    </html>
  );
}
