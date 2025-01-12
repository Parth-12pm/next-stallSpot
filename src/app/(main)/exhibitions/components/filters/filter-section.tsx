"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DateRange } from "react-day-picker";
import { PriceRangeFilter } from "./price-range";
import { DurationFilter } from "./duration";
import { EventTypeFilter } from "./event-type";
import { StallOptionsFilter } from "./stall-options";
import { LocationFilter } from "./location-filter";

export function FilterSection() {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <div className="space-y-6 bg-card rounded-lg p-6 shadow-md border border-border">
      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="location">
          <AccordionTrigger className="text-base font-semibold">Location</AccordionTrigger>
          <AccordionContent className="pt-4">
            <LocationFilter />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="date">
          <AccordionTrigger className="text-base font-semibold">Date Range</AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
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
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-semibold">Price Range</AccordionTrigger>
          <AccordionContent className="pt-4">
            <PriceRangeFilter />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="duration">
          <AccordionTrigger className="text-base font-semibold">Event Duration</AccordionTrigger>
          <AccordionContent className="pt-4">
            <DurationFilter />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger className="text-base font-semibold">Event Type</AccordionTrigger>
          <AccordionContent className="pt-4">
            <EventTypeFilter />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stall">
          <AccordionTrigger className="text-base font-semibold">Stall Features</AccordionTrigger>
          <AccordionContent className="pt-4">
            <StallOptionsFilter />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      <div className="flex flex-col gap-2">
        <Button variant="default" className="w-full">
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}