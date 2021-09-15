import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CrawlerModule } from './modules/crawler/crawler.module';

@Module({
  imports: [UsersModule, CrawlerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
