"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const durations = [
  { id: "1day", label: "1 Day" },
  { id: "2-3days", label: "2-3 Days" },
  { id: "week", label: "Week Long" },
  { id: "longer", label: "Longer" },
];

export function DurationFilter() {
  return (
    <RadioGroup defaultValue="2-3days" className="space-y-4">
      {durations.map((duration) => (
        <div key={duration.id} className="flex items-center space-x-2">
          <RadioGroupItem value={duration.id} id={duration.id} />
          <Label htmlFor={duration.id} className="text-sm font-normal cursor-pointer">
            {duration.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}