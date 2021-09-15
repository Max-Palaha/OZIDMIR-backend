import { Module } from '@nestjs/common';
import { CrawlerUtilsModule } from '../utils/crawler/crawler.utils.module';
import { CrawlerServiceUtils } from '../utils/crawler/crawler.utils.service';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';

@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService, CrawlerServiceUtils],
  imports: [CrawlerUtilsModule],
})
export class CrawlerModule {}
