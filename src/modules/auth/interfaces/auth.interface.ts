import { IUser } from 'src/modules/users/interfaces';
import { IToken } from '.';

export type IAuth = {
  token: IToken;
  user: IUser;
};
