import { IAuth } from '@auth/interfaces';
import { cookieSymbol } from '@common/constants/metadata.symbols.constants';
import { MetadataStorageDto } from '@common/dto/metadata.storage.dto';
import { CookieDataMap } from '../utils/cookie.data.map';
import { Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

type UnknownFunctionType = (...args: unknown[]) => unknown;

function isFunction(value: unknown): value is UnknownFunctionType {
  return typeof value === 'function';
}

export function Cookieable(fieldName: string): MethodDecorator {
  return <T>(
    targetClass: Record<string, unknown>,
    method: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> => {
    if (!isFunction(descriptor.value)) {
      throw new Error('Invalid use of decorator');
    }
    const originalFunction: UnknownFunctionType = descriptor.value;
    const cookieParams: MetadataStorageDto[] = Reflect.getOwnMetadata(cookieSymbol, targetClass, method);

    async function decoratedFunction(this: unknown, ...args: unknown[]): Promise<unknown> {
      const cookieDataMap: CookieDataMap = new CookieDataMap();
      const response: Response = cookieDataMap.prepareData(args, cookieParams);
      const userData: IAuth = await originalFunction.apply(this, args);

      if (!userData || (userData && !userData.tokens)) {
        throw new HttpException('invalid data for decorator', HttpStatus.NOT_FOUND);
      }
      cookieDataMap.setValue(fieldName, response, userData.tokens.refreshToken);

      return userData;
    }

    return {
      value: decoratedFunction as unknown as T,
    };
  };
}
