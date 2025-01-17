"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative mb-8">
      <div className="relative group">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        <Input
          placeholder="Search exhibitions, venues, or organizers..."
          className="pl-10 w-full h-12 text-lg transition-all duration-200 hover:shadow-md focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-primary/20"
        />
      </div>
    </div>
  );
}