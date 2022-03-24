import { Module } from '@nestjs/common';
import { ContinentModule } from '../continent/continent.module';
import { S3Module } from '@core/s3/s3.module';
import { CountryModule } from '../country/country.module';
import { AuthUtilsModule } from '../utils/auth/auth.utils.module';
import { SiteNumbeoModule } from '../utils/crawlSites/numbeo/numbeo.site.module';
import { UnsplashModule } from '../utils/crawlSites/unsplash/unsplash.site.module';
import { SiteWorldPopModule } from '../utils/crawlSites/worldPop/worldPop.site.module';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService],
  imports: [
    SiteNumbeoModule,
    SiteWorldPopModule,
    ContinentModule,
    AuthUtilsModule,
    CountryModule,
    UnsplashModule,
    S3Module,
  ],
})
export class CrawlerModule {}
