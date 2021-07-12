import { model, Schema, Document, PaginateModel } from 'mongoose';
import MongoosePaginate from 'mongoose-paginate-v2';
import { USER_TYPES } from '../shared/constants';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    required: true,
    type: String,
  },
  createdDate: {
    type: Date,
    default: new Date(),
  },
  location: {
    city: String,
    country: String,
    postalCode: String,
    address: String
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  age: Number,
  isDeleted: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  instagramUsername: String,
  paypalEmail: String,
  type: {
    type: String,
    enum: Object.values(USER_TYPES)
  },
  isVerified:{
    type: Boolean,
    default: false
  },
  verificationToken:{
    type: String,
    required: false
  },
  passwordResetToken:{
    type: String,
    required: false
  }
});

UserSchema.plugin(MongoosePaginate);

export interface IUser {
  name: string;
  phoneNumber: string;
  createdDate: Date;
  email: string;
  age?: number;
  location?: {
    city?: string;
    country?: string;
    postalCode?: string;
    address?: string;
  };
  isDeleted: boolean;
  password?: string;
  type: string;
  isVerified?: boolean;
  verificationToken?: string;
  passwordResetToken?: string;
}

export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends PaginateModel<IUserDocument> {}

export const UserModel: IUserModel = model('users', UserSchema);
