import { ArgumentMetadata, Injectable, PipeTransform, Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ValidationException } from '../exception/validation.exception';
@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
  async transform(value: string, metadata: ArgumentMetadata): Promise<unknown> {
    const result: Type<unknown> = plainToClass(metadata.metatype, value);
    const errors: ValidationError[] = await validate(result);
    if (errors.length) {
      const messages: string[] = errors.map((err: ValidationError) => {
        return `${err.property} - ${Object.values(err.constraints).join(',')}`;
      });
      throw new ValidationException(messages);
    }
    return value;
  }
}
