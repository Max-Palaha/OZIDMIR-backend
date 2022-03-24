import { IObjectId } from '@core/mongoose/interfaces';

export interface IRole {
  id: IObjectId;
  name: string;
  description: string;
}
