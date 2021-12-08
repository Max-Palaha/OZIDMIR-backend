import { IObjectId } from 'src/modules/core/mongoose/interfaces';

export type ICreateCountry = {
  name: string;
  population: string;
  density: string;
  continent?: IObjectId;
};
