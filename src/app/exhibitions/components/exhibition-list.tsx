"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ExhibitionCard } from "./exhibition-card";
import { exhibitions } from "../data/mock";

export function ExhibitionList() {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4">
        {exhibitions.map((exhibition) => (
          <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
        ))}
      </div>
    </ScrollArea>
  );
}