// app/(main)/layout.tsx
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

function LoadingSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background antialiased">
      <Navigation />
      <Suspense fallback={<LoadingSpinner />}>
        <main className="flex-1 w-full mx-auto">
          {children}
        </main>
      </Suspense>
      <Footer />
    </div>
  );
}