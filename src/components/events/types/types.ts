// src/components/events/types/type.ts

export interface Event {
    id: string;
    title: string;
    description: string;
    venue: string;
    numberOfStalls: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    entryFee?: string;  // Optional entry fee
    facilities: string[];
    category: string;
    layout?: string;
    thumbnail?: string;
    organizerId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Stall {
    id: number;
    type: string;
    price: string;
    size: string;
    status: 'available' | 'reserved' | 'booked';
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

// Add type guard for checking organizer role