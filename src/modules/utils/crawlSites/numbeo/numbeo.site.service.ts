import { Injectable } from '@nestjs/common';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';

@Injectable()
export class SiteNumbeoService {
  private readonly url: string = 'https://www.numbeo.com/';
  constructor(private crawlerServiceUtil: CrawlerServiceUtils) {}

  async scrapeSite(): Promise<boolean> {
    await this.crawlerServiceUtil.crawl(this.url);

    return true;
  }
}
