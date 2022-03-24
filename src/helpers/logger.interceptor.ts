import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const currentDate: number = Date.now();

    Logger.log(`${method} ${url} started 0ms`, context.getClass().name);

    return call
      .handle()
      .pipe(tap(() => Logger.log(`${method} ${url} ${Date.now() - currentDate}ms`, context.getClass().name)));
  }
}
