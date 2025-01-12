// lib/validations/event.ts
import { z } from 'zod';

export const eventFormSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  venue: z.string()
    .min(2, 'Venue must be at least 2 characters')
    .max(200, 'Venue must not exceed 200 characters'),
  numberOfStalls: z.number()
    .min(1, 'Must have at least 1 stall')
    .max(1000, 'Cannot exceed 1000 stalls'),
  startDate: z.string()
    .refine(date => new Date(date) > new Date(), {
      message: 'Start date must be in the future',
    }),
  endDate: z.string()
    .refine(date => new Date(date) > new Date(), {
      message: 'End date must be in the future',
    }),
  startTime: z.string(),
  endTime: z.string(),
  bookingFee: z.string()
    .regex(/^\d+$/, 'Booking fee must be a number'),
  entryFee: z.string()
    .regex(/^\d+$/, 'Entry fee must be a number')
    .optional(),
  facilities: z.array(z.string()),
  category: z.string(),
  thumbnail: z.any().optional(), // Will be handled separately
  layout: z.any().optional(),    // Will be handled separately
});

// Type inference
export type EventFormData = z.infer<typeof eventFormSchema>;