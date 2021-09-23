import { Module } from '@nestjs/common';
import { CrawlerUtilsModule } from '../../crawler/crawler.utils.module';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';
import { SiteNumbeoService } from './numbeo.site.service';

@Module({
  providers: [SiteNumbeoService, CrawlerServiceUtils],
  exports: [SiteNumbeoService],
  imports: [CrawlerUtilsModule],
})
export class SiteNumbeoModule {}
