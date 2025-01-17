"use client"

import { createContext, useContext, useState } from "react"
import type { FilterState, FilterContextType } from "@/types/exhibition"

const initialFilters: FilterState = {
  search: "",
  categorySearch: "",
  selectedCategories: [],
  selectedTags: [],
  dateRange: undefined,
  priceRange: [5000],
  duration: "2-3days",
  eventTypes: [],
  stallOptions: [],
  locations: [],
}

// Create context with default values
const FilterContext = createContext<FilterContextType>({
  filters: initialFilters,
  updateFilters: () => null,
  resetFilters: () => null,
})

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const updateFilters = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  const value = {
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

export const useFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}

