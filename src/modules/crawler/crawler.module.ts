import { Module } from '@nestjs/common';
import { ContinentModule } from '@module/continent/continent.module';
import { S3Module } from '@core/s3/s3.module';
import { CountryModule } from '@module/country/country.module';
import { AuthModule } from '@auth/auth.module';
import { SiteNumbeoModule } from '@libs/crawler/sites/numbeo/numbeo.site.module';
import { UnsplashModule } from '@libs/crawler/sites/unsplash/unsplash.site.module';
import { SiteWorldPopModule } from '@libs/crawler/sites/worldPop/worldPop.site.module';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService],
  imports: [SiteNumbeoModule, SiteWorldPopModule, ContinentModule, AuthModule, CountryModule, UnsplashModule, S3Module],
})
export class CrawlerModule {}
