import { Module } from '@nestjs/common';
import { CrawlerModule } from '@libs/crawler/crawler.module';
import { UnsplashService } from './unsplash.site.service';

@Module({
  providers: [UnsplashService],
  exports: [UnsplashService],
  imports: [CrawlerModule],
})
export class UnsplashModule {}
