import { cookieSymbol } from '@common/constants/metadata.symbols.constants';
import { MetadataStorageDto } from '@common/dto/metadata.storage.dto';
import { CookieDataMap } from '../utils/cookie.data.map';
import { Response } from 'express';

type UnknownFunctionType = (...args: unknown[]) => unknown;

function isFunction(value: unknown): value is UnknownFunctionType {
  return typeof value === 'function';
}

export function CookieEvict(fieldName: string): MethodDecorator {
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
      cookieDataMap.clearValue(fieldName, response);

      return originalFunction.apply(this, args);
    }

    return {
      value: decoratedFunction as unknown as T,
    };
  };
}
