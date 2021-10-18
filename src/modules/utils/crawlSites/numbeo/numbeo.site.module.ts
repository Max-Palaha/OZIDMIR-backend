import { Module } from '@nestjs/common';
import { CrawlerUtilsModule } from '../../crawler/crawler.utils.module';
import { SiteNumbeoService } from './numbeo.site.service';

@Module({
  providers: [SiteNumbeoService],
  exports: [SiteNumbeoService],
  imports: [CrawlerUtilsModule],
})
export class SiteNumbeoModule {}
