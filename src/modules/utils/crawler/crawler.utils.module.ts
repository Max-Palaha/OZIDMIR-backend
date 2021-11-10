import { Module } from '@nestjs/common';
import { HEADLESS, headlessProvider } from './helpers/crawler.providers';
import { CrawlerServiceUtils } from './crawler.utils.service';

@Module({
  imports: [],
  providers: [CrawlerServiceUtils, headlessProvider],
  exports: [CrawlerServiceUtils, HEADLESS],
})
export class CrawlerUtilsModule {}
