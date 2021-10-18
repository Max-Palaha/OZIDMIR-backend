import { TContinent } from '../interfaces/continent.interface';
import { ContinentDocument } from '../schemas/continent.schema';

export default (continent: ContinentDocument): TContinent => {
  return {
    id: continent._id.toString(),
    name: continent.name,
  };
};
