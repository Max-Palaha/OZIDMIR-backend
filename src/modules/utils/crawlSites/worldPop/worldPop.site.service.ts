import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElementHandle, Page } from 'puppeteer';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';
import { clickContPage, waitPageContOpt } from './constants';
import { scrapeContinents } from './interfaces';

@Injectable()
export class SiteWorldPopService {
  private readonly SITE_URL = 'https://worldpopulationreview.com/';
  private readonly LOCL = 1; // location of continent link
  private readonly CONTINENT_LIST = 0;
  private readonly NAVIGATION_ID = '#main-nav a';
  private readonly CONTINENTS_LISTS_ID = '.content ul';
  private readonly CONTINENT_NAMES_ID = 'li a';
  constructor(private crawlerServiceUtil: CrawlerServiceUtils) {}

  public async scrapeContinents(): Promise<scrapeContinents> {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SITE_URL);
    try {
      const mainLinks: ElementHandle[] = await page.$$(this.NAVIGATION_ID);
      const continentLink = Array.from(mainLinks)[this.LOCL];

      await continentLink.click(clickContPage);
      await page.waitForSelector(this.CONTINENTS_LISTS_ID, waitPageContOpt);

      const contentLists = await page.$$(this.CONTINENTS_LISTS_ID);
      const continentsList = Array.from(contentLists)[this.CONTINENT_LIST];
      const continentElements = await continentsList.$$(
        this.CONTINENT_NAMES_ID,
      );
      const continents = await continentsList.$$eval(
        this.CONTINENT_NAMES_ID,
        (els) => els.map((el) => el.innerHTML),
      );
      await this.crawlerServiceUtil.closePage(page);

      return {
        continents: Array.from(continents),
        continentElements: continentElements,
      };
    } catch (error) {
      await this.crawlerServiceUtil.closePage(page);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
