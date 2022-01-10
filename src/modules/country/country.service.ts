/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContinentService } from '../continent/continent.service';
import { Logger } from '../core/logger/helpers/logger.decorator';
import { dumpCountries } from './dump';
import { ICountry } from './interfaces/country.interface';
import { Country, CountryDocument } from './schemas/country.schema';
import * as mongoose from 'mongoose';
import { ICountries } from '../utils/crawlSites/worldPop/interfaces';

@Injectable()
export class CountryService {
  constructor(
    @Logger('CountryService') private logger: LoggerService,
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
    private continentService: ContinentService,
  ) {}
  async getCountry(): Promise<ICountry[]> {
    const countries = await this.countryModel.find().populate('continent').lean();
    // console.log(countries);
    return countries.map(dumpCountries);
  }
  async findCountryByName(name: string): Promise<CountryDocument> {
    const country = await this.countryModel.findOne({ name }).lean();
    //console.log(country);
    return country;
  }
  async createCountry(newCountry: ICountries): Promise<void> {
    const country = await this.countryModel.create(newCountry);

    await country.save();
  }

  async createCountries(countries: ICountries[], continentId: mongoose.Schema.Types.ObjectId): Promise<void> {
    const countriesPromise = countries.map((val) => {
      val.continent = continentId;
      this.createCountry(val);
    });
    await Promise.all(countriesPromise);
  }
  async countCountriesByContinents(continent: mongoose.Schema.Types.ObjectId): Promise<number> {
    const count = await this.countryModel.find(continent).count();

    return count;
  }
}
