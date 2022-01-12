import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ContinentService } from '../continent/continent.service';
import { CountryService } from '../country/country.service';
import { SiteNumbeoService } from '../utils/crawlSites/numbeo/numbeo.site.service';
import { IScrapeContinents, IScrapeCountries, ICountries } from '../utils/crawlSites/worldPop/interfaces';
import { SiteWorldPopService } from '../utils/crawlSites/worldPop/worldPop.site.service';
import { SiteTurizmService } from '../utils/crawlSites/Turizm/turizm.site.service';

@Injectable()
export class CrawlerService {
  private readonly NOT_EXIST_CONTINENT = 'not exist continent';
  constructor(
    private turizmService: SiteTurizmService,
    private numbeoService: SiteNumbeoService,
    private worldPopService: SiteWorldPopService,
    private continentService: ContinentService,
    private countryService: CountryService,
  ) {}

  async scrapeContent(url: string) {
    await this.numbeoService.scrapeSite(url);

    return true;
  }

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
  async scrapeCities(countryName: string): Promise<string[]> {
    const cities = await this.numbeoService.scrapeAllCitiesByCountry(countryName);
    return cities;
  }
  async scrapeAttraction(countryName: string, cityName: string): Promise<string[]> {
    const attractions = await this.turizmService.scrapeAttractionsOfCity(countryName, cityName);
    return attractions;
  }
}
