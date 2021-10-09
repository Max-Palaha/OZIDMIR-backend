import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from './mongoose/mongoose.module';
import configuration from '../../helpers/configuration';

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
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {}
