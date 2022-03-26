import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Continent, ContinentDocument } from './schemas/continent.schema';
import { TContinent } from './interfaces';
import { dumpContinents } from './dump';

@Injectable()
export class ContinentService {
  private readonly CONTINENT_EXIST_ERROR: string = 'Continent already exist';
  constructor(@InjectModel(Continent.name) private continentModel: Model<ContinentDocument>) {}

  async getContinents(): Promise<TContinent[]> {
    const continents: ContinentDocument[] = await this.continentModel.find().lean();

    return continents.map(dumpContinents);
  }

  async findContinentByName(name: string): Promise<ContinentDocument> {
    const continent: ContinentDocument = await this.continentModel.findOne({ name }).lean();

    return continent;
  }

  async createContinent(name: string): Promise<void> {
    const existContinent: ContinentDocument = await this.findContinentByName(name);

    if (!existContinent) {
      throw new HttpException(this.CONTINENT_EXIST_ERROR, HttpStatus.BAD_REQUEST);
    }

    await this.continentModel.create({ name });
  }

  async createContinents(continents: string[]): Promise<void> {
    const continentsPromise: Promise<void>[] = continents.map(this.createContinent.bind(this));

    await Promise.all(continentsPromise);
  }

  async countContinents(): Promise<number> {
    const count: number = await this.continentModel.count();

    return count;
  }
}
