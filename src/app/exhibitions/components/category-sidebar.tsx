"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { categories } from "../data/mock";
import { FilterSection } from "./filters/filter-section";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CategorySearch } from "./category-search";

export function CategorySidebar() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 shadow-md border border-border">
        <h3 className="font-semibold mb-4">Categories</h3>
        <CategorySearch />
        <ScrollArea className="h-[250px]">
          {categories.map((category) => (
            <div key={category} className="mb-3 flex items-center space-x-2">
              <Checkbox id={category} />
              <Label 
                htmlFor={category} 
                className="text-sm font-normal cursor-pointer hover:text-primary transition-colors"
              >
                {category}
              </Label>
            </div>
          ))}
        </ScrollArea>
      </div>
      
      <FilterSection />
    </div>
  );
}