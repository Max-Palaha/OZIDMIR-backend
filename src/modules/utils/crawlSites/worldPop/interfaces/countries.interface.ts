import * as mongoose from 'mongoose';

export interface ICountries {
  continent?: mongoose.Schema.Types.ObjectId;
  name: string;
  population: string;
  density: string;
}
