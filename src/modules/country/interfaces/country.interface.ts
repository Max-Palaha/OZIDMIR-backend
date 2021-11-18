import { ObjectId } from 'mongoose';

export type ICountry = {
  id: ObjectId;
  name: string;
  population: string;
  density: string;
};
