"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const eventTypes = [
  { id: "indoor", label: "Indoor Events" },
  { id: "outdoor", label: "Outdoor Events" },
  { id: "hybrid", label: "Hybrid Events" },
  { id: "international", label: "International Events" },
];

export function EventTypeFilter() {
  return (
    <div className="space-y-4">
      {eventTypes.map((type) => (
        <div key={type.id} className="flex items-center space-x-2">
          <Checkbox id={type.id} />
          <Label htmlFor={type.id} className="text-sm font-normal cursor-pointer">
            {type.label}
          </Label>
        </div>
      ))}
    </div>
  );
}