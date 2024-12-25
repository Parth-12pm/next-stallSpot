"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function PriceRangeFilter() {
  const [value, setValue] = useState([5000]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Maximum Price (₹)</Label>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹0</span>
          <span>₹{value[0].toLocaleString()}</span>
        </div>
      </div>
      <Slider
        defaultValue={value}
        max={50000}
        min={0}
        step={1000}
        onValueChange={setValue}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:shadow-lg [&_[role=slider]]:border-2"
      />
    </div>
  );
}