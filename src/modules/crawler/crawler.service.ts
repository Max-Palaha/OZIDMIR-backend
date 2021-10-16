import { Injectable } from '@nestjs/common';
import { ContinentService } from '../continent/continent.service';
import { SiteNumbeoService } from '../utils/crawlSites/numbeo/numbeo.site.service';
import { IScrapeContinents, IScrapeCountries, ICountries } from '../utils/crawlSites/worldPop/interfaces';
import { SiteWorldPopService } from '../utils/crawlSites/worldPop/worldPop.site.service';

@Injectable()
export class CrawlerService {
  constructor(
    private numbeoService: SiteNumbeoService,
    private worldPopService: SiteWorldPopService,
    private continentService: ContinentService,
  ) {}

  async scrapeContent(url: string) {
    await this.numbeoService.scrapeSite(url);

    return true;
  }

  async scrapeCountry(continent: string): Promise<ICountries[]> {
    const { countries }: IScrapeCountries = await this.worldPopService.scrapeCountryByContinent(continent);

    return countries;
  }

  async scrapeContinents(): Promise<string[]> {
    const { continents }: IScrapeContinents = await this.worldPopService.scrapePageContinents();

    const count = await this.continentService.countContinents();
    console.log(count);
    if (!count) {
      await this.continentService.createContinents(continents);
    }

    return continents;
  }
}
