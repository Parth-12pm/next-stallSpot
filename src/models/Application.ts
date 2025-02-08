// models/Application.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '@/models/User';
import { IEvent } from '@/models/Event';

interface IProduct {
  productName: string;
  productDetails: string;
}

interface IFees {
  stallPrice: number;
  platformFee: number;
  entryFee: number;
  gst: number;
  totalAmount: number;
}

export interface IApplication extends Document {
  eventId: mongoose.Types.ObjectId | IEvent;
  vendorId: mongoose.Types.ObjectId | IUser;
  stallId: number;
  status: 'pending' | 'approved' | 'rejected' | 'payment_pending' | 'payment_completed' | 'expired';
  products: IProduct[];
  applicationDate: Date;
  approvalDate?: Date;
  rejectionReason?: string;
  paymentDeadline?: Date;
  fees: IFees;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  productName: { 
    type: String, 
    required: true,
    minlength: 2 
  },
  productDetails: { 
    type: String, 
    required: true,
    minlength: 10 
  }
}, { _id: false });

const FeesSchema = new Schema({
  stallPrice: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  entryFee: { type: Number, required: true },
  gst: { type: Number, required: true },
  totalAmount: { type: Number, required: true }
}, { _id: false });

const ApplicationSchema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stallId: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'payment_pending', 'payment_completed', 'expired'],
    default: 'pending'
  },
  products: {
    type: [ProductSchema],
    required: true,
    validate: [
      {
        validator: function(products: IProduct[]) {
          return products.length > 0;
        },
        message: 'At least one product is required'
      }
    ]
  },
  applicationDate: { type: Date, default: Date.now },
  approvalDate: Date,
  rejectionReason: String,
  paymentDeadline: Date,
  fees: FeesSchema
}, {
  timestamps: true
});

// Index for preventing multiple active applications
ApplicationSchema.index(
  { eventId: 1, vendorId: 1 },
  { 
    unique: true,
    partialFilterExpression: { 
      status: { $in: ['pending', 'approved', 'payment_pending'] }
    }
  }
);

// Auto-expire payment_pending applications after 24 hours
ApplicationSchema.index(
  { paymentDeadline: 1 },
  { expireAfterSeconds: 0 }
);

const Application = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;