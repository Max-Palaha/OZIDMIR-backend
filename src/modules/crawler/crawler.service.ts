import { Injectable } from '@nestjs/common';
import { CrawlerServiceUtils } from '../utils/crawler/crawler.utils.service';

@Injectable()
export class CrawlerService {
  constructor(private crawlerServiceUtil: CrawlerServiceUtils) {}

  async scrapeContent(url: string) {
    await this.crawlerServiceUtil.crawl(url);

    return true;
  }
}
