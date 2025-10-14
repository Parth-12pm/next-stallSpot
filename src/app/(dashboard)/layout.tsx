// app/(dashboard)/layout.tsx
import type React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Script from "next/script";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v2/checkout.js"
        strategy="lazyOnload"
      />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
