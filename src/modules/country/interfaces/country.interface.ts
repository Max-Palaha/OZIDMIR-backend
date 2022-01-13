import { IObjectId } from '../../core/mongoose/interfaces';

export type ICountry = {
  id: IObjectId;
  name: string;
  continent: {
    id: IObjectId;
    name: string;
  };
  population: string;
  density: string;
  image: string;
};
