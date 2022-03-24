import { IObjectId } from '@core/mongoose/interfaces';

export interface IUserSearch {
  _id?: IObjectId;
  activationLink?: string;
}
