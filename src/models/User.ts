// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: 'organizer' | 'vendor';
  profileComplete: boolean;
  dateOfBirth?: Date;
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  contact?: string;
  address?: string;
  companyDetails?: {
    companyName?: string;
    registrationType?: 'CIN' | 'GSTIN' | 'UDYAM';
    registrationNumber?: string;
    website?: string;
  };
  accountDetails?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
  };
  selfDescription?: string;
  profilePicture?: string;
}

const UserSchema = new Schema({
  // Required fields for initial signup
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  role: { type: String, enum: ['organizer', 'vendor'], required: true },
  profileComplete: { type: Boolean, default: false },
  
  // Optional fields
  dateOfBirth: { type: Date },
  googleId: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  contact: String,
  address: String,
  
  // Company details - required structure varies by role
  companyDetails: {
    _id: false,
    companyName: {
      type: String,
      validate: {
        validator: function(this: IUser, value: string | undefined) {
          if (this.role === 'organizer') return !!value;
          if (this.companyDetails?.registrationNumber || this.companyDetails?.registrationType) return !!value;
          return true;
        },
        message: 'Company name is required for organizers or when providing company details'
      }
    },
    registrationType: { 
      type: String,
      enum: ['CIN', 'GSTIN', 'UDYAM'],
      validate: {
        validator: function(this: IUser, value: string | undefined) {
          if (this.role === 'organizer') return !!value;
          if (this.companyDetails?.companyName || this.companyDetails?.registrationNumber) return !!value;
          return true;
        },
        message: 'Registration type is required for organizers or when providing company details'
      }
    },
    registrationNumber: {
      type: String,
      validate: {
        validator: function(this: IUser, value: string | undefined) {
          if (this.role === 'organizer') return !!value;
          if (this.companyDetails?.companyName || this.companyDetails?.registrationType) return !!value;
          return true;
        },
        message: 'Registration number is required for organizers or when providing company details'
      }
    },
    website: String
  },

  accountDetails: {
    _id: false,
    bankName: String,
    accountNumber: String,
    ifscCode: String
  },

  selfDescription: String,
  profilePicture: String
}, {
  timestamps: true
});

// Password validation
UserSchema.pre('save', function(next) {
  if (this.isNew && !this.googleId && !this.password) {
    next(new Error('Password is required for email signup'));
  }
  next();
});

// Profile completion validation
UserSchema.pre('save', function(next) {
  if (this.profileComplete) {
    const requiredFields = ['contact', 'address', 'dateOfBirth', 'accountDetails', 'selfDescription'];
    
    // Check common required fields
    for (const field of requiredFields) {
      if (!this[field as keyof IUser]) {
        return next(new Error(`${field} is required for profile completion`));
      }
    }

    // Company details validation
    if (this.role === 'organizer') {
      if (!this.companyDetails?.companyName || 
          !this.companyDetails?.registrationType ||
          !this.companyDetails?.registrationNumber) {
        return next(new Error('Complete company details are required for organizers'));
      }
    } else if (this.companyDetails) {
      // For vendors, validate only if any company detail is provided
      const hasAnyDetail = !!(
        this.companyDetails.companyName ||
        this.companyDetails.registrationType ||
        this.companyDetails.registrationNumber
      );

      const hasAllDetails = !!(
        this.companyDetails.companyName &&
        this.companyDetails.registrationType &&
        this.companyDetails.registrationNumber
      );

      if (hasAnyDetail && !hasAllDetails) {
        return next(new Error('All company details must be provided if including any company information'));
      }
    }
  }
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;