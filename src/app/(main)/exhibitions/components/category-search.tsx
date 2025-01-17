"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function CategorySearch() {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search categories..."
        className="pl-9 text-sm"
      />
    </div>
  );
}