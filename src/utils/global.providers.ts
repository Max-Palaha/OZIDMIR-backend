import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from 'src/helpers/http-error.filter';
import { LoggerInterceptor } from 'src/helpers/logger.interceptor';

export const LoggerInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: LoggerInterceptor,
};

export const HttpErrorFilterProvider = {
  provide: APP_FILTER,
  useClass: HttpErrorFilter,
};
