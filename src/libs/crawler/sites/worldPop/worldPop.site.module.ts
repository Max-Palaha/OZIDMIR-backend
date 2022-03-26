import { Module } from '@nestjs/common';
import { CrawlerModule } from '@libs/crawler/crawler.module';
import { SiteWorldPopService } from './worldPop.site.service';

@Module({
  providers: [SiteWorldPopService],
  exports: [SiteWorldPopService],
  imports: [CrawlerModule],
})
export class SiteWorldPopModule {}
