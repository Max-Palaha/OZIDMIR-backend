import { Module } from '@nestjs/common';
import { CrawlerModule } from '@libs/crawler/crawler.module';
import { SiteNumbeoService } from './numbeo.site.service';

@Module({
  providers: [SiteNumbeoService],
  exports: [SiteNumbeoService],
  imports: [CrawlerModule],
})
export class SiteNumbeoModule {}
