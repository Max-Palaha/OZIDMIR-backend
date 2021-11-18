/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ScrapeCountryDto {
  @ApiProperty({ example: 'Europe', description: 'name of continent', required: true })
  @IsString({ message: 'Necessary type string' })
  readonly country: string;
}
