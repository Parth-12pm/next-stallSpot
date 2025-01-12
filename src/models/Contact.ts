import mongoose from 'mongoose';

// Interface for the Contact Form Submission
export interface IContact {
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
  status?: 'new' | 'read' | 'responded';
}

// Mongoose Schema
const ContactSchema = new mongoose.Schema<IContact>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    required: false
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded'],
    default: 'new'
  }
});

// Prevent recompiling the model
export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);