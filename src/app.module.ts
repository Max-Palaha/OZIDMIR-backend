import { Module } from '@nestjs/common';
import { HttpErrorFilterProvider, LoggerInterceptorProvider } from './utils/global.providers';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { UsersModule } from './modules/users/users.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { MailModule } from './modules/core/mail/mail.module';
import { TokensModule } from './modules/tokens/tokens.module';

@Module({
  imports: [CoreModule, UsersModule, CrawlerModule, AuthModule, RoleModule, MailModule, TokensModule],
  controllers: [],
  providers: [LoggerInterceptorProvider, HttpErrorFilterProvider],
})
export class AppModule {}
