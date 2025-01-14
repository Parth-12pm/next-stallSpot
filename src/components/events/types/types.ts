// src/components/events/types/types.ts
export interface Event {
    _id: string;  // Changed from id to _id to match MongoDB
    title: string;
    description: string;
    venue: string;
    numberOfStalls: number;
    startDate: string;
    endDate: string;
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
    };
    onSave?: (stalls: Stall[]) => Promise<void>;
    readOnly?: boolean;
    isOrganizer?: boolean;
}

export interface EventPreviewProps {
    eventId: string;
}

export interface EventData {
    title: string;
    thumbnail: string;
    description: string;
    startDate: string;
    endDate: string;
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

