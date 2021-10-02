import { Module } from '@nestjs/common';
import { CrawlerUtilsModule } from '../utils/crawler/crawler.utils.module';
import { SiteNumbeoModule } from '../utils/crawlSites/numbeo/numbeo.site.module';
import { SiteWorldPopModule } from '../utils/crawlSites/worldPop/worldPop.site.module';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService],
  imports: [SiteNumbeoModule, CrawlerUtilsModule, SiteWorldPopModule],
})
export class CrawlerModule {}
