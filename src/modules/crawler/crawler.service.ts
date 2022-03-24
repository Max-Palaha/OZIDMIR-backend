import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ContinentService } from '../continent/continent.service';
import { S3Service } from '@core/s3/s3.service';
import { CountryService } from '../country/country.service';
import { UnsplashService } from '../utils/crawlSites/unsplash/unsplash.site.service';
import { IScrapeContinents, IScrapeCountries, ICountries } from '../utils/crawlSites/worldPop/interfaces';
import { SiteWorldPopService } from '../utils/crawlSites/worldPop/worldPop.site.service';

@Injectable()
export class CrawlerService {
  private readonly NOT_EXIST_CONTINENT = 'not exist continent';
  private readonly FOLDER_NAME_COUNTRIES = 'countries';
  constructor(
    private worldPopService: SiteWorldPopService,
    private unsplashService: UnsplashService,
    private continentService: ContinentService,
    private countryService: CountryService,
    private s3Service: S3Service,
  ) {}

  async scrapeCountry(continentName: string): Promise<ICountries[]> {
    const continent = await this.continentService.findContinentByName(continentName);

    if (!continent) {
      throw new HttpException(this.NOT_EXIST_CONTINENT, HttpStatus.BAD_REQUEST);
    }

    const { countries }: IScrapeCountries = await this.worldPopService.scrapeCountryByContinent(continentName);
    const count = await this.countryService.countCountriesByContinent(continent._id);

    if (!count) {
      await this.countryService.createCountries(countries, continent._id);
    }

    return countries;
  }

  async scrapeContinents(): Promise<string[]> {
    const { continents }: IScrapeContinents = await this.worldPopService.scrapePageContinents();

    const count = await this.continentService.countContinents();
    if (!count) {
      await this.continentService.createContinents(continents);
    }

    return continents;
  }

  async scrapeImagesByCountries(): Promise<boolean> {
    try {
      const countries = await this.countryService.getCountriesWithoutImage();
      const countriesPromises = countries.slice(0, 10).map(async (country) => {
        const buffer = await this.unsplashService.getImageByCountry(country.name);
        const image = await this.s3Service.uploadImage(buffer, this.FOLDER_NAME_COUNTRIES, country.continent.id);
        await this.countryService.updateCountryById(country.id, { image });
      });

      await Promise.all(countriesPromises);

      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
