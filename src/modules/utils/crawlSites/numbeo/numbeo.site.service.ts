import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';

@Injectable()
export class SiteNumbeoService {
  private readonly SITE_URL = 'https://www.numbeo.com/';
  constructor(private crawlerServiceUtil: CrawlerServiceUtils) {}

  async scrapeSite(url: string) {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SITE_URL);

    return true;
  }
}
