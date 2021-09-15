import { Injectable } from '@nestjs/common';

@Injectable()
export class CrawlerServiceUtils {
  async crawl(url: string) {
    return url;
  }
}
