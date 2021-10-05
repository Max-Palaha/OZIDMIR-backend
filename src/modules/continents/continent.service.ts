import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Continent, ContinentDocument } from './schemas/continent.schema';
import { dumpContinents } from './dump';
import { TContinent } from './interfaces';

@Injectable()
export class ContinentService {
  private readonly CONTINENT_EXIST_ERROR = 'Continent already exist';
  constructor(@InjectModel(Continent.name) private continentModel: Model<ContinentDocument>) {}

  async getContinents(): Promise<TContinent[]> {
    const continents = await this.continentModel.find().lean();

    return continents.map(dumpContinents);
  }

  async findContinentByName(name: string): Promise<ContinentDocument> {
    const continent = await this.continentModel.findOne({ name }).lean();

    return continent;
  }

  async createContinent(name: string): Promise<void> {
    const existContinent = await this.findContinentByName(name);

    if (!existContinent) {
      throw new HttpException(this.CONTINENT_EXIST_ERROR, HttpStatus.BAD_REQUEST);
    }

    const continent = await this.continentModel.create({ name });

    await continent.save();
  }

  async createContinents(continents: string[]): Promise<void> {
    const continentsPromise = continents.map(this.createContinent.bind(this));

    await Promise.all(continentsPromise);
  }

  async countContinents(): Promise<number> {
    const count = await this.continentModel.count();

    return count;
  }
}
