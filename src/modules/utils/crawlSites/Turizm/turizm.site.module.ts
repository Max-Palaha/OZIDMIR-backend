import { Module } from '@nestjs/common';
import { CrawlerUtilsModule } from '../../crawler/crawler.utils.module';
import { SiteTurizmService } from './turizm.site.service';

@Module({
  providers: [SiteTurizmService],
  exports: [SiteTurizmService],
  imports: [CrawlerUtilsModule],
})
export class SiteTurizmModule {}
