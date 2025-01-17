// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth"
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}