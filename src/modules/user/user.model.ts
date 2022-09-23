import { User } from '../../types/user.type.js';
import mongoose from 'mongoose';

export interface UserDocument extends User, mongoose.Document {
  createAt: Date,
  updatedAt: Date,
}

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
    minLength: [1, 'User name min length is 1!'],
    maxLength: [15, 'User name max length is 15!'],
  },
  email: {
    type: String,
    require: true,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
  },
  avatarLink: {
    type: String,
    default: 'http://img.com/1.jpg'
  },
  password: {
    type: String,
    minLength: [6, 'User password min length is 6!'],
    maxLength: [12, 'User password max length is 12!'],
  },
}, {
  timestamps: true,
});

export const userModel = mongoose.model<UserDocument>('User', userSchema);
