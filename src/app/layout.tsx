// app/layout.tsx
import React from "react";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider";
// Import your auth options
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pass the auth options to getServerSession
  const session = await getServerSession(authOptions);

  // Add this console log to debug server-side session
  console.log('Server-side session:', JSON.stringify(session, null, 2));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <AuthProvider session={session}>
            {children}
            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}