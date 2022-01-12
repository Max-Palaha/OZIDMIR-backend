import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';

@Injectable()
export class SiteTurizmService {
  private readonly url = 'https://www.turizm.ru/';
  private readonly Attractions = '#list_pl .b_data_head.mq-xs-b_data_head [title]';
  constructor(private crawlerServiceUtil: CrawlerServiceUtils) {}

  async scrapePage(country: string, city: string): Promise<Page> {
    const page: Page = await this.crawlerServiceUtil.crawl(this.url + country + '/' + city + '/places/');

    return page;
  }

  async scrapeAttractionsOfCity(country: string, city: string) {
    const page = await this.scrapePage(country, city);
    try {
      const allAttractionsContent = await page.$$eval(this.Attractions, (els) =>
        els.map((el) => {
          return el.textContent;
        }),
      );
      const attractionsArray = Array.from(allAttractionsContent);
      return attractionsArray;
    } catch (error) {
      await this.crawlerServiceUtil.closePage(page);
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
