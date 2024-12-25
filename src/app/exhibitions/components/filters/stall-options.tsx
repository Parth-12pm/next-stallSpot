"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const stallOptions = [
  { id: "corner", label: "Corner Stalls" },
  { id: "premium", label: "Premium Location" },
  { id: "power", label: "Power Backup" },
  { id: "wifi", label: "Wi-Fi Access" },
];

export function StallOptionsFilter() {
  return (
    <div className="space-y-4">
      {stallOptions.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox id={option.id} />
          <Label htmlFor={option.id} className="text-sm font-normal cursor-pointer">
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
}