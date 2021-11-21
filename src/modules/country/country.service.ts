import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';
import { Logger } from '../core/logger/helpers/logger.decorator';
import { LoggerService } from '../core/logger/logger.service';
import { ICountry, ICreateCountry } from './interfaces';
import { dumpCountry } from './dump';

@Injectable()
export class CountryService {
  private readonly CONTINENT_EXIST_ERROR = 'Country already exist';
  constructor(
    @Logger('CountryService') private logger: LoggerService,
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {}

  async getCountries(): Promise<ICountry[]> {
    const countries = await this.countryModel.find().lean();

    return countries.map(dumpCountry);
  }

  async findCountryByName(name: string): Promise<CountryDocument> {
    const country = await this.countryModel.findOne({ name }).lean();

    return country;
  }

  async createCountry(country: ICreateCountry): Promise<void> {
    const createdCountry = await this.countryModel.create(country);

    await createdCountry.save();
  }

  async createCountries(countries: ICreateCountry[], continent: mongoose.Schema.Types.ObjectId): Promise<void> {
    const countriesPromise = countries.map((country) => this.createCountry({ ...country, continent }));

    await Promise.all(countriesPromise);
  }

  async countCountriesByContinent(continent: mongoose.Schema.Types.ObjectId): Promise<number> {
    const count = await this.countryModel.find({ continent } as FilterQuery<CountryDocument>).count();

    return count;
  }
}
