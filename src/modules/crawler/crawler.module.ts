import { Module } from '@nestjs/common';
import { CrawlerServiceUtils } from '../utils/crawler/crawler.utils.service';
import { SiteNumbeoModule } from '../utils/crawlSites/numbeo/numbeo.site.module';
import { SiteNumbeoService } from '../utils/crawlSites/numbeo/numbeo.site.service';
import { SiteWorldPopService } from '../utils/crawlSites/worldPop/worldPop.site.service';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';

@Module({
  controllers: [CrawlerController],
  providers: [
    CrawlerService,
    SiteNumbeoService,
    CrawlerServiceUtils,
    SiteWorldPopService,
  ],
  imports: [SiteNumbeoModule],
})
export class CrawlerModule {}
