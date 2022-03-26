import { MONGO_OPTIONS } from './constants/options';
import { ConfigService } from '@nestjs/config';
import { IDatabaseConfig } from './interfaces';

export class MongoModule {
  static async useFactory(configService: ConfigService): Promise<{ uri: string }> {
    const { uri } = await configService.get<Promise<IDatabaseConfig>>('mongo');
    return {
      uri,
      ...MONGO_OPTIONS,
    };
  }
}
