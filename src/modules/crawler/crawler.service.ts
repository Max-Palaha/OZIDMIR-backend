import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ContinentService } from '../continent/continent.service';
import { CountryService } from '../country/country.service';
import { SiteNumbeoService } from '../utils/crawlSites/numbeo/numbeo.site.service';
import { IScrapeContinents, IScrapeCountries, ICountries } from '../utils/crawlSites/worldPop/interfaces';
import { SiteWorldPopService } from '../utils/crawlSites/worldPop/worldPop.site.service';

@Injectable()
export class CrawlerService {
  constructor(
    private numbeoService: SiteNumbeoService,
    private worldPopService: SiteWorldPopService,
    private continentService: ContinentService,
    private countryService: CountryService,
  ) {}
  private readonly CONTINENT_EXIST_ERROR = 'Error';
  async scrapeContent(url: string) {
    await this.numbeoService.scrapeSite(url);

    return true;
  }

  async scrapeCountry(name: string): Promise<ICountries[]> {
    try {
      const continent = await this.continentService.findContinentByName(name);
      //console.log(continent);
      if (!continent) {
        throw new HttpException(this.CONTINENT_EXIST_ERROR, HttpStatus.BAD_REQUEST);
      }
      const { countries }: IScrapeCountries = await this.worldPopService.scrapeCountryByContinent(name);
      const count = await this.countryService.countCountriesByContinents(continent._id);
      console.log(countries);
      if (!count) {
        await this.countryService.createCountries(countries, continent._id);
      }
      //console.log(countries);
      return countries;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async scrapeContinents(): Promise<string[]> {
    const { continents }: IScrapeContinents = await this.worldPopService.scrapePageContinents();

    const count = await this.continentService.countContinents();
    //console.log(count);
    if (!count) {
      await this.continentService.createContinents(continents);
    }

    return continents;
  }
}
