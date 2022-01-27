import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class CountriesDto {
  @ApiProperty({ example: 'Europe', description: 'name' })
  readonly continent: string;

  @ApiProperty({ example: 'Europe', description: 'name' })
  @Type(() => Number)
  @IsNumber({},{ message: 'Necessary type number' })
  @Min(0)
  offset: number;

  @Type(() => Number)
  @IsNumber({},{ message: 'Necessary type number' })
  @Min(0)
  limit: number;
}
