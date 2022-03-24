import { IUser } from '../../users/interfaces';
import { IToken } from '.';

export type IAuth = {
  tokens: IToken;
  user: IUser;
};
