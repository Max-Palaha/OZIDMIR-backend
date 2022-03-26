import { Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './http-error.filter';
import { LoggerInterceptor } from './logger.interceptor';

export const LoggerInterceptorProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: LoggerInterceptor,
};

export const HttpErrorFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: HttpErrorFilter,
};
