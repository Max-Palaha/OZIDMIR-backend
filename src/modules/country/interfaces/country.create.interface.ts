import { IObjectId } from '../../core/mongoose/interfaces';

export type ICreateCountry = {
  name: string;
  populationRank?: string;
  population: string;
  density: string;
  capital?: string;
  subregion?: string;
  medianAge?: string;
  medianManAge?: string;
  medianWomanAge?: string;
  continent?: IObjectId;
};
