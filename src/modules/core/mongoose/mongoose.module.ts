import { MONGO_OPTIONS } from './constants/options';
import { ConfigService } from '@nestjs/config';
import { IDatabaseConfig } from './interfaces';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export class MongoModule {
  static async useFactory(configService: ConfigService): Promise<{ uri: string; options: MongooseModuleOptions }> {
    const { uri } = await configService.get<Promise<IDatabaseConfig>>('mongo');
    return {
      uri,
      options: MONGO_OPTIONS,
    };
  }
}
