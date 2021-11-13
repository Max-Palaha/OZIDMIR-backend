import { Module } from '@nestjs/common';
import { ContinentModule } from '../continent/continent.module';
import { AuthUtilsModule } from '../utils/auth/auth.utils.module';
import { SiteNumbeoModule } from '../utils/crawlSites/numbeo/numbeo.site.module';
import { SiteWorldPopModule } from '../utils/crawlSites/worldPop/worldPop.site.module';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService],
  imports: [SiteNumbeoModule, SiteWorldPopModule, ContinentModule, AuthUtilsModule],
})
export class CrawlerModule {}
