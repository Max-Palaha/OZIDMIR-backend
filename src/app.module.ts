import { Module } from '@nestjs/common';
import { HttpErrorFilterProvider, LoggerInterceptorProvider } from './utils/global.providers';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { UsersModule } from './modules/users/users.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { ImageUploadModule } from './modules/upload/image.upload.module';

@Module({
  imports: [CoreModule, UsersModule, CrawlerModule, AuthModule, RoleModule, ImageUploadModule],
  controllers: [],
  providers: [LoggerInterceptorProvider, HttpErrorFilterProvider],
})
export class AppModule {}
