import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaginationParamDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'Necessary type number' })
  @Min(0)
  offset: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Necessary type number' })
  @Min(0)
  limit: number;
}
