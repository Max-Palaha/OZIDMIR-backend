import { Module } from '@nestjs/common';
import { HEADLESS, headlessProvider } from './constants';
import { CrawlerServiceUtils } from './crawler.utils.service';

@Module({
  imports: [],
  providers: [CrawlerServiceUtils, headlessProvider],
  exports: [CrawlerServiceUtils, HEADLESS],
})
export class CrawlerUtilsModule {}
