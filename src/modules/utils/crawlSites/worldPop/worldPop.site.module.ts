import { Module } from '@nestjs/common';
import { CountryModule } from 'src/modules/country/country.module';
import { CrawlerUtilsModule } from '../../crawler/crawler.utils.module';
import { SiteWorldPopService } from './worldPop.site.service';

@Module({
  providers: [SiteWorldPopService],
  exports: [SiteWorldPopService],
  imports: [CrawlerUtilsModule,CountryModule],
})
export class SiteWorldPopModule {}
