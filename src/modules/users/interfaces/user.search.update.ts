import { ObjectId } from 'mongoose';

export interface IUserSearch {
  _id?: ObjectId;
  activationLink?: string;
}
