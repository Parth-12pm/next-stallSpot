import React from "react";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { AuthProvider } from "@/providers/auth-provider";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider session={session}>
          <Navigation />
          <main className="min-h-screen">{children}
          <Analytics />
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}