import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: 'visitor' | 'organizer' | 'vendor';
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
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
    enum: ['visitor', 'organizer', 'vendor'],
    required: true,
  },
  googleId: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);