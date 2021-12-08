import { IObjectId } from 'src/modules/core/mongoose/interfaces';

export type ICountry = {
  id: IObjectId;
  name: string;
  continent: {
    id: IObjectId;
    name: string;
  };
  population: string;
  density: string;
};
