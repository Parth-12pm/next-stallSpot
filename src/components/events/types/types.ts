// src/components/events/types/types.ts
import type { DateRange } from "react-day-picker"


export interface Event {
    _id: string;  // Changed from id to _id to match MongoDB
    title: string;
    description: string;
    venue: string;
    numberOfStalls: number;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    entryFee?: string;
    facilities: string[];
    category: string;
    layout?: string;
    thumbnail?: string;
    organizerId: string;
    status: 'draft' | 'published' | 'completed' | 'cancelled';
    stallConfiguration: Stall[];
    configurationComplete: boolean;
    createdAt: string;
    updatedAt: string;
}

// Rest of your types remain the same
export interface Stall {
    stallId: number;
    displayId: string;
    type: 'standard' | 'premium' | 'corner';
    category: string;
    name: string;
    price: string;
    size: string;
    status: 'available' | 'reserved' | 'blocked' | 'booked';
}

export interface StallFormProps {
    eventId: string;
    eventDetails: {
        category: string;
        numberOfStalls: number;
        layout: string;
    };
    onSave?: (stalls: Stall[]) => Promise<void>;
    readOnly?: boolean;
    isOrganizer?: boolean;
    onStallSelect?: (stall: Stall) => void; // Added this prop
}

export interface EventPreviewProps {
    eventId: string;
}

export interface EventData {
    title: string;
    thumbnail: string;
    description: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    venue: string;
    category: string;
    charges: string;
    totalStalls: number;
    facilities: string[];
}

// API Response Types
export interface StallApiResponse {
    stalls: Stall[];
    eventCategory: string;
    numberOfStalls: number;
}

export interface EventApiResponse {
    _id: string;
    title: string;
    category: string;
    numberOfStalls: number;
    configurationComplete: boolean;
}

// First, we define what our filter state looks like
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
  
  // Then, we define the shape of our context
  export interface FilterContextType {
    filters: FilterState          // The current state of all filters
    updateFilters: (key: keyof FilterState, value: FilterState[keyof FilterState]) => void  // Function to update a specific filter
    resetFilters: () => void     // Function to reset all filters to their initial state
  }
  