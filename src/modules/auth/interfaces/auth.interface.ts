import { IUser } from '../../users/interfaces';
import { IToken } from '.';

export type IAuth = {
  token: IToken;
  user: IUser;
};
