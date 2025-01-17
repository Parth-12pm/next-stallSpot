"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Search, SlidersHorizontal, CalendarIcon, MapPin, Clock, IndianRupee } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import type { Event, FilterState } from "@/components/events/types/types"
import { tags } from "./mock"
import { ExhibitionFilters } from "./exhibition-filters"

interface ExhibitionComponentsProps {
  exhibitions?: Event[],
  categories: string[]
}

const initialFilters: FilterState = {
  search: "",
  dateRange: undefined,
  category: "",
  selectedTags: [],
  stallTypes: [],
  facilities: [],
  priceRange: [0, 50000],
  venue: [],
}

export function ExhibitionComponents({ exhibitions = [] }: ExhibitionComponentsProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  const filteredExhibitions = useMemo(() => {
    return exhibitions.filter(exhibition => {
      if (!exhibition) return false

      // Search filter
      if (filters.search && !exhibition.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Category filter
      if (filters.category && exhibition.category !== filters.category) {
        return false
      }

      // Date range filter
      if (filters.dateRange?.from && filters.dateRange?.to) {
        const startDate = new Date(exhibition.startDate)
        if (startDate < filters.dateRange.from || startDate > filters.dateRange.to) {
          return false
        }
      }

      // Venue filter
      if (filters.venue.length > 0 && !filters.venue.some(v => exhibition.venue.includes(v))) {
        return false
      }

      // Facilities filter
      if (filters.facilities.length > 0 && !filters.facilities.every(f => exhibition.facilities.includes(f))) {
        return false
      }

      // Stall types filter
      if (filters.stallTypes.length > 0 && !exhibition.stallConfiguration.some(s => filters.stallTypes.includes(s.type))) {
        return false
      }

      return true
    })
  }, [exhibitions, filters])

  return (
    <div className="container mx-auto p-20">
      {/* Header with search */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Find Exhibitions</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)] mt-8">
                <ExhibitionFilters 
                  filters={filters} 
                  updateFilter={updateFilter} 
                  resetFilters={resetFilters} 
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search exhibitions..."
            className="pl-10 h-12"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        {/* Tags */}
        <ScrollArea className="pb-4">
          <div className="flex gap-3">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={filters.selectedTags.includes(tag.id) ? "default" : "secondary"}
                className="px-4 py-1.5 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105 whitespace-nowrap"
                onClick={() => {
                  updateFilter("selectedTags", 
                    filters.selectedTags.includes(tag.id)
                      ? filters.selectedTags.filter(t => t !== tag.id)
                      : [...filters.selectedTags, tag.id]
                  )
                }}
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex gap-6 mt-8">
        {/* Desktop Filters */}
        <div className="hidden lg:block w-[300px] flex-shrink-0">
          <ExhibitionFilters 
            filters={filters} 
            updateFilter={updateFilter} 
            resetFilters={resetFilters} 
          />
        </div>

        {/* Mobile Filters in Sheet - This was moved from above the Exhibition List */}
        <Sheet>
          <SheetContent>
            <ExhibitionFilters 
              filters={filters} 
              updateFilter={updateFilter} 
              resetFilters={resetFilters} 
            />
          </SheetContent>
        </Sheet>

        {/* Exhibition List */}
        <div className="flex-1">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {filteredExhibitions.length > 0 ? (
                filteredExhibitions.map((exhibition) => (
                  <ExhibitionCard key={exhibition._id} exhibition={exhibition} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No exhibitions found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

function ExhibitionCard({ exhibition }: { exhibition: Event }) {
  const {
    title,
    thumbnail = '/placeholder.svg?height=400&width=600',
    venue,
    startDate,
    endDate,
    startTime,
    endTime,
    entryFee = 'Free Entry',
    numberOfStalls,
    category,
  } = exhibition

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border border-border">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative h-[200px] md:h-auto overflow-hidden">
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-6 md:w-2/3">
          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {format(new Date(startDate), "MMM d, yyyy")} - {format(new Date(endDate), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{startTime} - {endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              <span>{entryFee}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {numberOfStalls} stalls
            </Badge>
            <Badge>
              {category}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}

