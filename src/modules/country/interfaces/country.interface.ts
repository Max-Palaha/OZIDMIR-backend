import { IObjectId } from '../../core/mongoose/interfaces';

export type ICountry = {
  id: IObjectId;
  name: string;
  continent: {
    id: IObjectId;
    name: string;
  };
  population: string;
  populationRank: string;
  populationAge:{
    medianAge: string;
    medianManAge: string;
    medianWomanAge: string;
  }
  density: string;
  capital: string;
  subregion: string;
  image: string;
};
