import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './helpers/http-error.filter';

@Module({
  imports: [UsersModule, CrawlerModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
