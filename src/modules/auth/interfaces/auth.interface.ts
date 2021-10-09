import { IUser } from 'src/modules/users/interfaces';

export type IAuth = {
  token: string;
  user: IUser;
};
