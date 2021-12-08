import { Module } from '@nestjs/common';
import { CrawlerUtilsModule } from '../../crawler/crawler.utils.module';
import { UnsplashService } from './unsplash.site.service';

@Module({
  providers: [UnsplashService],
  exports: [UnsplashService],
  imports: [CrawlerUtilsModule],
})
export class UnsplashModule {}
