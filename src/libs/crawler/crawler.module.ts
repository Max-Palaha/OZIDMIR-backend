import { Module } from '@nestjs/common';
import { HEADLESS, headlessProvider } from './helpers/crawler.providers';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [],
  providers: [CrawlerService, headlessProvider],
  exports: [CrawlerService, HEADLESS],
})
export class CrawlerModule {}
