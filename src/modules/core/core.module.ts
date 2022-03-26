import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from './mongoose/mongoose.module';
import { MailModule } from './mail/mail.module';
import configuration from '@common/helpers/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: MongoModule.useFactory,
      inject: [ConfigService],
    }),
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {}
