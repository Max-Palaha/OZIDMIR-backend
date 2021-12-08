import { IObjectId } from 'src/modules/core/mongoose/interfaces';

export interface IRole {
  id: IObjectId;
  name: string;
  description: string;
}
