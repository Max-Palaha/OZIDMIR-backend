import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';
import { Logger } from '../core/logger/helpers/logger.decorator';
import { LoggerService } from '../core/logger/logger.service';
import { ICountry, ICountryUpdatedFields, ICreateCountry } from './interfaces';
import { dumpCountry } from './dump';
import { IObjectId } from '../core/mongoose/interfaces';

@Injectable()
export class CountryService {
  constructor(
    @Logger('CountryService') private logger: LoggerService,
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {}

  async getCountries(): Promise<ICountry[]> {
    const countries = await this.countryModel.find().lean();

    return countries.map(dumpCountry);
  }

  async getCountriesWithoutImage(): Promise<ICountry[]> {
    const countries = await this.countryModel.find({ image: null }).lean();

    return countries.map(dumpCountry);
  }

  async getCountryByName(name: string): Promise<CountryDocument> {
    const country = await this.countryModel.findOne({ name }).lean();

    return country;
  }

  async createCountry(country: ICreateCountry): Promise<void> {
    const createdCountry = await this.countryModel.create(country);

    await createdCountry.save();
  }

  async updateCountryById(countryId: IObjectId, updatedFileds: ICountryUpdatedFields): Promise<void> {
    try {
      await this.countryModel.updateOne({ _id: countryId }, updatedFileds);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCountryByName(countryName: string, updatedFileds: ICountryUpdatedFields): Promise<void> {
    try {
      await this.countryModel.updateOne({ name: countryName }, updatedFileds);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCountries(countries: ICreateCountry[], continent: IObjectId): Promise<void> {
    const countriesPromise = countries.map((country) => this.createCountry({ ...country, continent }));

    await Promise.all(countriesPromise);
  }

  async countCountriesByContinent(continent: mongoose.Schema.Types.ObjectId): Promise<number> {
    const count = await this.countryModel.find({ continent } as FilterQuery<CountryDocument>).count();

    return count;
  }
}
