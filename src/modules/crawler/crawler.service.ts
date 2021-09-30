import { Injectable } from '@nestjs/common';
import { SiteNumbeoService } from '../utils/crawlSites/numbeo/numbeo.site.service';
import { IScrapeContinents, IScrapeCountries, TCountries } from '../utils/crawlSites/worldPop/interfaces';
import { SiteWorldPopService } from '../utils/crawlSites/worldPop/worldPop.site.service';

@Injectable()
export class CrawlerService {
  constructor(private numbeoService: SiteNumbeoService, private worldPopService: SiteWorldPopService) {}

  async scrapeContent(url: string) {
    await this.numbeoService.scrapeSite(url);

    return true;
  }

  async scrapeCountry(continent: string): Promise<TCountries[]> {
    const { countries }: IScrapeCountries = await this.worldPopService.scrapeCountryByContinent(continent);

    return countries;
  }

  async scrapeContinents(): Promise<string[]> {
    const { continents }: IScrapeContinents = await this.worldPopService.scrapePageContinents();

    return continents;
  }
}
