import { prefixesForLoggers } from './logger.decorator';
import { Provider } from '@nestjs/common';
import { LoggerService } from '../logger.service';

function loggerFactory(logger: LoggerService, prefix: string): LoggerService {
  if (prefix) {
    logger.setPrefix(prefix);
  }
  return logger;
}

const createLoggerProvider = (prefix: string): Provider<LoggerService> => {
  return {
    provide: `LoggerService${prefix}`,
    useFactory: (logger: LoggerService): LoggerService => loggerFactory(logger, prefix),
    inject: [LoggerService],
  };
};

export function createLoggerProviders(): Array<Provider<LoggerService>> {
  return prefixesForLoggers.map((prefix) => createLoggerProvider(prefix));
}
