"use client"

import { createContext, useContext, useState } from "react"
import type { FilterState, FilterContextType } from "@/components/events/types/types"

// Define initial filter state
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

// Create the context with default values
const FilterContext = createContext<FilterContextType>({
  filters: initialFilters,
  updateFilters: () => null,
  resetFilters: () => null,
})

// Create the provider component
export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const updateFilters = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  // Create the value object that will be provided to consumers
  const value: FilterContextType = {
    filters,
    updateFilters,
    resetFilters,
  }

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
}

// Create a custom hook to use the filter context
export function useFilters() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}

