import { Module } from '@nestjs/common';
import { CrawlerUtilsModule } from '../../crawler/crawler.utils.module';
import { SiteWorldPopService } from './worldPop.site.service';

@Module({
  providers: [SiteWorldPopService],
  exports: [SiteWorldPopService],
  imports: [CrawlerUtilsModule],
})
export class SiteWorldPopModule {}
