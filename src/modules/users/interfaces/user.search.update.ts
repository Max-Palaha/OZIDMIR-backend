import { IObjectId } from 'src/modules/core/mongoose/interfaces';

export interface IUserSearch {
  _id?: IObjectId;
  activationLink?: string;
}
