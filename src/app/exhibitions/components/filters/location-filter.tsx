"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const locations = [
  { id: "mumbai", label: "Mumbai" },
  { id: "delhi", label: "Delhi" },
  { id: "bangalore", label: "Bangalore" },
  { id: "hyderabad", label: "Hyderabad" },
  { id: "chennai", label: "Chennai" },
  { id: "kolkata", label: "Kolkata" },
  { id: "pune", label: "Pune" },
  { id: "ahmedabad", label: "Ahmedabad" },
];

export function LocationFilter() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredLocations = locations.filter(location =>
    location.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-3">
          {filteredLocations.map((location) => (
            <div key={location.id} className="flex items-center space-x-2">
              <Checkbox id={location.id} />
              <Label 
                htmlFor={location.id}
                className="text-sm font-normal cursor-pointer hover:text-primary transition-colors"
              >
                {location.label}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}