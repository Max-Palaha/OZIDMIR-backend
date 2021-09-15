import { Module } from '@nestjs/common';
import { CrawlerServiceUtils } from './crawler.utils.service';

@Module({
  imports: [],
  providers: [CrawlerServiceUtils],
  exports: [CrawlerServiceUtils],
})
export class CrawlerUtilsModule {}
