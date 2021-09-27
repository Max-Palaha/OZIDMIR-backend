/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ScrapeCountryDto {
  @ApiProperty({ example: 'ObjectId', description: 'name of continent', required: true })
  @IsString({ message: 'Необхідний тип string' })
  readonly continent: string;
}