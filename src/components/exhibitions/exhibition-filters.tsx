"use client"

import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { FilterState } from "@/components/events/types/types"


export const categories = [
  "Trade Shows",
  "Art Exhibitions",
  "Food Festivals",
  "Tech Conferences",
  "Fashion Shows",
  "Business Expos",
  "Cultural Events",
  "Education Fairs",
]

export const facilities = [
  "Wi-Fi",
  "Power Backup",
  "Security",
  "Parking",
  "Food Court",
  "Air Conditioning",
  "Loading/Unloading",
  "Storage Space",
]

export const venues = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
]

export const statusFilters = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Upcoming" },
  { value: "completed", label: "Past Events" },
  { value: "cancelled", label: "Cancelled" },
];

export const stallTypes = [
  { value: "standard", label: "Standard Stalls" },
  { value: "premium", label: "Premium Stalls" },
  { value: "corner", label: "Corner Stalls" },
];


interface FiltersProps {
  filters: FilterState
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void
}

export function ExhibitionFilters({ filters, updateFilter, resetFilters }: FiltersProps) {
  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["category", "date", "venue", "facilities", "stalls"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={filters.category === category}
                    onCheckedChange={() => {
                      updateFilter("category", filters.category === category ? "" : category)
                    }}
                  />
                  <Label htmlFor={category}>{category}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="date">
          <AccordionTrigger>Date Range</AccordionTrigger>
          <AccordionContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={filters.dateRange}
                  onSelect={(dateRange) => updateFilter("dateRange", dateRange)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="venue">
          <AccordionTrigger>Venue</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {venues.map((venue) => (
                <div key={venue} className="flex items-center space-x-2">
                  <Checkbox
                    id={venue}
                    checked={filters.venue.includes(venue)}
                    onCheckedChange={(checked) => {
                      updateFilter("venue",
                        checked
                          ? [...filters.venue, venue]
                          : filters.venue.filter(v => v !== venue)
                      )
                    }}
                  />
                  <Label htmlFor={venue}>{venue}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="facilities">
          <AccordionTrigger>Facilities</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {facilities.map((facility) => (
                <div key={facility} className="flex items-center space-x-2">
                  <Checkbox
                    id={facility}
                    checked={filters.facilities.includes(facility)}
                    onCheckedChange={(checked) => {
                      updateFilter("facilities",
                        checked
                          ? [...filters.facilities, facility]
                          : filters.facilities.filter(f => f !== facility)
                      )
                    }}
                  />
                  <Label htmlFor={facility}>{facility}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stalls">
          <AccordionTrigger>Stall Types</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {stallTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.value}
                    checked={filters.stallTypes.includes(type.value)}
                    onCheckedChange={(checked) => {
                      updateFilter("stallTypes",
                        checked
                          ? [...filters.stallTypes, type.value]
                          : filters.stallTypes.filter(t => t !== type.value)
                      )
                    }}
                  />
                  <Label htmlFor={type.value}>{type.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

