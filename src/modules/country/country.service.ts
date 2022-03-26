import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';
import { ICountry, ICountryUpdatedFields, ICreateCountry } from './interfaces';
import { dumpCountry } from './dump';
import { IObjectId } from '../core/mongoose/interfaces';
import { CountriesDto } from './dto/get.countries.dto';

@Injectable()
export class CountryService {
  constructor(@InjectModel(Country.name) private countryModel: Model<CountryDocument>) {}

  async getCountries(filterDto: CountriesDto): Promise<ICountry[]> {
    const filter: { 'continent.name'?: string } = filterDto.continent ? { 'continent.name': filterDto.continent } : {};
    try {
      const countriesDocument: CountryDocument[] = await this.countryModel
        .aggregate([
          {
            $lookup: {
              from: 'continents',
              localField: 'continent',
              foreignField: '_id',
              as: 'continent',
            },
          },
          { $unwind: '$continent' },
          { $match: filter },
        ])
        .skip(filterDto.offset)
        .limit(filterDto.limit);

      return countriesDocument.map(dumpCountry);
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCountriesWithoutImage(): Promise<ICountry[]> {
    const countries: CountryDocument[] = await this.countryModel.find({ image: null }).lean();

    return countries.map(dumpCountry);
  }

  async getCountryByName(name: string): Promise<CountryDocument> {
    const country: CountryDocument = await this.countryModel.findOne({ name }).lean();

    return country;
  }

  async createCountry(country: ICreateCountry): Promise<void> {
    await this.countryModel.create(country);
  }

  async updateCountryById(countryId: IObjectId, updatedFileds: ICountryUpdatedFields): Promise<void> {
    try {
      await this.countryModel.updateOne({ _id: countryId }, updatedFileds);
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCountryByName(countryName: string, updatedFileds: ICountryUpdatedFields): Promise<void> {
    try {
      await this.countryModel.updateOne({ name: countryName }, updatedFileds);
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCountries(countries: ICreateCountry[], continent: IObjectId): Promise<void> {
    const countriesPromise: Promise<void>[] = countries.map((country) => this.createCountry({ ...country, continent }));

    await Promise.all(countriesPromise);
  }

  async countCountriesByContinent(continent: mongoose.Schema.Types.ObjectId): Promise<number> {
    const count: number = await this.countryModel.find({ continent } as FilterQuery<CountryDocument>).count();

    return count;
  }
}
