// app/creator-studio/components/header.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="h-14 border-b px-4 flex items-center justify-between bg-background">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Go back">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-semibold">Floor Plan Creator</h1>
      </div>
      <Button variant="ghost" size="icon" aria-label="Open settings">
        <Settings className="h-4 w-4" />
      </Button>
    </header>
  );
}