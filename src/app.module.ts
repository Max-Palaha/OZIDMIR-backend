import { Module } from '@nestjs/common';
import { HttpErrorFilterProvider, LoggerInterceptorProvider } from './utils/global.providers';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { UsersModule } from './modules/users/users.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { MailModule } from './modules/core/mail/mail.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3, SharedIniFileCredentials } from 'aws-sdk';
import { CsvParserModule } from './modules/core/csv.parser/csv-parser/csv-parser.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    CrawlerModule,
    AuthModule,
    CsvParserModule,
    RoleModule,
    MailModule,
    TokensModule,
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: process.env.AWS_REGION,
        credentials: new SharedIniFileCredentials({
          profile: process.env.AWS_PROFILE,
        }),
      },
      services: [S3],
    }),
  ],
  controllers: [],
  providers: [LoggerInterceptorProvider, HttpErrorFilterProvider],
})
export class AppModule {}
