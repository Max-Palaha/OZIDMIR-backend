import { Injectable } from '@nestjs/common';
import { CrawlerService } from '../../crawler.service';

@Injectable()
export class SiteNumbeoService {
  private readonly url: string = 'https://www.numbeo.com/';
  constructor(private crawlerServiceUtil: CrawlerService) {}

  async scrapeSite(): Promise<boolean> {
    await this.crawlerServiceUtil.crawl(this.url);

    return true;
  }
}
