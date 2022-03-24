import { IObjectId } from '@core/mongoose/interfaces';

export type ICreateCountry = {
  name: string;
  population: string;
  density: string;
  continent?: IObjectId;
};
