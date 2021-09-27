import { Module } from '@nestjs/common';
import { CrawlerUtilsModule } from '../../crawler/crawler.utils.module';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';
import { SiteWorldPopService } from './worldPop.site.service';

@Module({
  providers: [SiteWorldPopService, CrawlerServiceUtils],
  exports: [SiteWorldPopService],
  imports: [CrawlerUtilsModule],
})
export class SiteNumbeoModule {}
