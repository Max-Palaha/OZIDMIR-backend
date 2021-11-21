import { ObjectId } from 'mongoose';

export type IUser = {
  id: ObjectId;
  roles: string[];
  email: string;
  isActivated: boolean;
  userName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
};
