/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICountry } from '../interfaces/country.interface';
import { CountryDocument } from '../schemas/country.schema';

export default (country: CountryDocument): ICountry => {
  return {
    continent: country.continent._id.toString(),
    id: country._id.toString(),
    name: country.name,
    population: country.population,
    density: country.density,
  };
};
