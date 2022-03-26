import { DynamicModule, Provider } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { createLoggerProviders } from './helpers/logger.providers';

export class LoggerModule {
  static forRoot(): DynamicModule {
    const prefixedLoggerProviders: Provider<LoggerService>[] = createLoggerProviders();
    return {
      module: LoggerModule,
      providers: [LoggerService, ...prefixedLoggerProviders],
      exports: [LoggerService, ...prefixedLoggerProviders],
    };
  }
}
