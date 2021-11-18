import { ObjectId } from 'mongoose';

export type ICreateCountry = {
  name: string;
  population: string;
  density: string;
  continent?: ObjectId;
};
