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
  startDate: z.string(),
  endDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  entryFee: z.string()
    .regex(/^\d+$/, 'Entry fee must be a number')
    .optional(),
  facilities: z.array(z.string()),
  category: z.string(),
  thumbnail: z.any().optional(),
  layout: z.any().optional(),
}).refine((data) => {
  const startDateTime = new Date(`${data.startDate.split('T')[0]}T${data.startTime}`);
  const endDateTime = new Date(`${data.endDate.split('T')[0]}T${data.endTime}`);
  
  // Check if dates are the same
  const sameDay = startDateTime.toDateString() === endDateTime.toDateString();
  
  if (sameDay) {
    return data.startTime < data.endTime;
  }
  
  return endDateTime > startDateTime;
}, {
  message: "End date/time must be after start date/time",
  path: ["endDate"],
});

export type EventFormData = z.infer<typeof eventFormSchema>;
