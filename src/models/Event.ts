// models/Event.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IEvent extends Document {
  title: string;
  description: string;
  venue: string;
  numberOfStalls: number;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  bookingFee: string;
  entryFee?: string;
  facilities: string[];
  category: string;
  layout?: string;
  thumbnail?: string;
  organizerId: mongoose.Types.ObjectId | IUser;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  venue: { type: String, required: true },
  numberOfStalls: { type: Number, required: true, min: 1 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  bookingFee: { type: String, required: true },
  entryFee: { type: String },
  facilities: [{ type: String }],
  category: { type: String, required: true },
  layout: { type: String },
  thumbnail: { type: String },
  organizerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'completed', 'cancelled'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Validate dates
EventSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'));
  }
  if (this.startDate < new Date()) {
    next(new Error('Start date must be in the future'));
  }
  next();
});

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;