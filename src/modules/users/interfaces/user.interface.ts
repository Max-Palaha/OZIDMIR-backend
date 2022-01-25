import { IObjectId } from '../../core/mongoose/interfaces';

export type IUser = {
  id: IObjectId;
  roles: string[];
  email: string;
  isActivated: boolean;
  userName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
};
