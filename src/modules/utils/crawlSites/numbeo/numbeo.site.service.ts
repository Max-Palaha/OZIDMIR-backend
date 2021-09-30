import { Injectable } from '@nestjs/common';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';

@Injectable()
export class SiteNumbeoService {
  private readonly url = 'https://www.numbeo.com/';
  constructor(private crawlerServiceUtil: CrawlerServiceUtils) {}

  async scrapeSite(url: string) {
    await this.crawlerServiceUtil.crawl(url);

    return true;
  }
}
