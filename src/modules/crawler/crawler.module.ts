import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ContinentModule } from '../continent/continent.module';
import { CountryModule } from '../country/country.module';
import { SiteNumbeoModule } from '../utils/crawlSites/numbeo/numbeo.site.module';
import { SiteWorldPopModule } from '../utils/crawlSites/worldPop/worldPop.site.module';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService],
  imports: [SiteNumbeoModule, SiteWorldPopModule, ContinentModule, AuthModule, CountryModule],
})
export class CrawlerModule {}
