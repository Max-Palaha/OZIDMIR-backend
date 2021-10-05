import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Continent, ContinentDocument } from './schemas/continents.schema';

@Injectable()
export class ContinentsService {
  constructor(@InjectModel(Continent.name) private continentModel: Model<ContinentDocument>) {}

  async updateContinent(continent) {
    await this.continentModel.updateOne(continent);

    return true;
  }
}
