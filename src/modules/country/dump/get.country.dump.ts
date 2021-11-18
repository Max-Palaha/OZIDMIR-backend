import { ICountry } from '../interfaces';
import { CountryDocument } from '../schemas/country.schema';

export default (country: CountryDocument): ICountry => {
  return {
    id: country._id,
    name: country.name,
    population: country.population,
    density: country.density,
  };
};
