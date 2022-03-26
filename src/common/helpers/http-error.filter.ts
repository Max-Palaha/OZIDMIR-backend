import { Catch, ExceptionFilter, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ValidationException } from '@common/exception/validation.exception';

interface IErrorInfo {
  code: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | null;
  validation: string[];
  stack: string[];
}
@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException & ValidationException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();
    const status: number = exception?.getStatus();
    const validation: string[] = exception.messages || [];
    const { stack } = exception;
    const stacks: string[] = stack ? stack.split('\n').map(this.reformStack).filter(Boolean) : [];

    const errorResult: IErrorInfo = {
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

  private reformStack(stack: string): string {
    const folderName: string = process.env.npm_package_name; // name of folder project
    const [, url] = stack.trim().split(folderName);

    return url || '';
  }
}
