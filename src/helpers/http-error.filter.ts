import { Catch, ExceptionFilter, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { ValidationException } from '../exception/validation.exception';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException & ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception?.getStatus();
    const validation = exception.messages || [];
    const { stack } = exception;
    const stacks = stack ? stack.split('\n').map(this.reformStack).filter(Boolean) : [];

    const errorResult = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
      validation,
      stack: stacks,
    };

    Logger.error(`${request.method} ${request.url}`, JSON.stringify(errorResult), 'ExceptionFilter');

    response.status(status).json(errorResult);
  }

  private reformStack(stack: string) {
    const folderName = process.env.npm_package_name; // name of folder project
    const [, url] = stack.trim().split(folderName);

    return url || '';
  }
}
