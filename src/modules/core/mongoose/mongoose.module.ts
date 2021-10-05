import { MONGO_OPTIONS } from 'src/constants/options';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './interfaces/credentials.interface';

export class MongoModule {
  static async useFactory(configService: ConfigService) {
    const { uri } = await configService.get<Promise<DatabaseConfig>>('mongo');

    return {
      uri,
      ...MONGO_OPTIONS,
    };
  }
}
