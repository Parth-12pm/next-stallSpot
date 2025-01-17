"use client";

import { Badge } from "@/components/ui/badge";
import { tags } from "../data/mock";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TagList() {
  return (
    <ScrollArea className="mb-8 pb-4">
      <div className="flex gap-3">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="px-4 py-1.5 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105 whitespace-nowrap"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
}