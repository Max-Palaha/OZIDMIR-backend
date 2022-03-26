import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3Service } from '@core/s3/s3.service';
import { UnsplashService } from '@libs/crawler/sites/unsplash/unsplash.site.service';
import { IScrapeContinents, IScrapeCountries, ICountries } from '@libs/crawler/sites/worldPop/interfaces';
import { SiteWorldPopService } from '@libs/crawler/sites/worldPop/worldPop.site.service';
import { CountryService } from '@module/country/country.service';
import { ContinentService } from '@module/continent/continent.service';
import { ICountry, ICountryUpdatedFields } from '@module/country/interfaces';
import { ContinentDocument } from '@module/continent/schemas/continent.schema';

@Injectable()
export class CrawlerService {
  private readonly NOT_EXIST_CONTINENT: string = 'not exist continent';
  private readonly FOLDER_NAME_COUNTRIES: string = 'countries';
  constructor(
    private worldPopService: SiteWorldPopService,
    private unsplashService: UnsplashService,
    private continentService: ContinentService,
    private countryService: CountryService,
    private s3Service: S3Service,
  ) {}

  async scrapeCountry(continentName: string): Promise<ICountries[]> {
    const continent: ContinentDocument = await this.continentService.findContinentByName(continentName);

    if (!continent) {
      throw new HttpException(this.NOT_EXIST_CONTINENT, HttpStatus.BAD_REQUEST);
    }

    const { countries }: IScrapeCountries = await this.worldPopService.scrapeCountryByContinent(continentName);
    const count: number = await this.countryService.countCountriesByContinent(continent._id);

    if (!count) {
      await this.countryService.createCountries(countries, continent._id);
    }

    return countries;
  }

  async scrapeContinents(): Promise<string[]> {
    const { continents }: IScrapeContinents = await this.worldPopService.scrapePageContinents();

    const count: number = await this.continentService.countContinents();
    if (!count) {
      await this.continentService.createContinents(continents);
    }

    return continents;
  }

  async scrapeInfoAboutCountry(): Promise<boolean> {
    const countries: ICountryUpdatedFields[] = await this.worldPopService.scrapeInfoCountry();
    await Promise.all(countries.map((country) => this.countryService.updateCountryByName(country.name, country)));
    return true;
  }

  async scrapeImagesByCountries(): Promise<boolean> {
    try {
      const countries: ICountry[] = await this.countryService.getCountriesWithoutImage();
      const countriesPromises: Promise<void>[] = countries.slice(0, 10).map(async (country) => {
        const buffer: Buffer = await this.unsplashService.getImageByCountry(country.name);
        const image: string = await this.s3Service.uploadImage(
          buffer,
          this.FOLDER_NAME_COUNTRIES,
          country.continent.id,
        );
        await this.countryService.updateCountryById(country.id, { image });
      });

      await Promise.all(countriesPromises);

      return true;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
