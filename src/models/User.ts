// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

interface AccountDetails {
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

interface CompanyDetails {
  companyName: string;
  registrationNumber?: string;
  website?: string;
}

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: 'organizer' | 'vendor';
  profileComplete: boolean;
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  
  // Common fields
  contact?: string;
  address?: string;
  companyDetails?: CompanyDetails;
  accountDetails?: AccountDetails;
  selfDescription?: string;
  
  // Organizer specific fields
  profilePicture?: string;
  age?: number;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function(this: IUser) {
      return !this.googleId;
    }
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['organizer', 'vendor'],
    required: true,
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
  googleId: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Common fields
  contact: String,
  address: String,
  companyDetails: {
    companyName: String,
    registrationNumber: String,
    website: String,
  },
  accountDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
  },
  selfDescription: String,
  
  // Organizer specific fields
  profilePicture: String,
  age: Number,
}, {
  timestamps: true
});

// Add validation for selfDescription length using pre-save middleware
UserSchema.pre('save', function(next) {
  if (this.selfDescription) {
    const maxLength = this.role === 'organizer' ? 1000 : 250;
    if (this.selfDescription.length > maxLength) {
      const error = new Error(`Self description cannot be longer than ${maxLength} words`);
      return next(error);
    }
  }
  next();
});

// Handle the case where model might already be registered
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;