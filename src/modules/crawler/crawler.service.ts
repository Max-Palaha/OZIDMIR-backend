import { Injectable } from '@nestjs/common';
import { SiteNumbeoService } from '../utils/crawlSites/numbeo/numbeo.site.service';
import { scrapeContinents } from '../utils/crawlSites/worldPop/interfaces';
import { SiteWorldPopService } from '../utils/crawlSites/worldPop/worldPop.site.service';

@Injectable()
export class CrawlerService {
  constructor(
    private numbeoService: SiteNumbeoService,
    private worldPopService: SiteWorldPopService,
  ) {}

  async scrapeContent(url: string) {
    await this.numbeoService.scrapeSite(url);

    return true;
  }

  async scrapeContinents(): Promise<string[]> {
    const { continents }: scrapeContinents =
      await this.worldPopService.scrapeContinents();

    return continents;
  }
}
