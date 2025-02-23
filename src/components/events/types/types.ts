import type { DateRange } from "react-day-picker"
import type { IStall } from "@/models/Event"

export interface StallFormProps {
  eventId: string
  eventDetails: {
    category: string
    numberOfStalls: number
    layout: string
  }
  onSave?: (stalls: IStall[]) => Promise<void>
  readOnly?: boolean
  isOrganizer?: boolean
  userRole?: string
  onStallSelect?: (stall: IStall) => void
}

export interface EventPreviewProps {
  eventId: string
}


export interface EventData {
  title: string
  thumbnail: string
  description: string
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  venue: string
  category: string
  charges: string
  totalStalls: number
  facilities: string[]
}

export interface StallApiResponse {
  stalls: IStall[]
  eventCategory: string
  numberOfStalls: number
}

export interface EventApiResponse {
  _id: string
  title: string
  category: string
  numberOfStalls: number
  configurationComplete: boolean
}

export interface FilterState {
  search: string
  dateRange: DateRange | undefined
  category: string
  selectedTags: string[]
  stallTypes: string[]
  facilities: string[]
  priceRange: [number, number]
  venue: string[]
}

export interface FilterContextType {
  filters: FilterState
  updateFilters: (key: keyof FilterState, value: FilterState[keyof FilterState]) => void
  resetFilters: () => void
}

