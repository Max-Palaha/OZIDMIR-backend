/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ScrapeCityAttractionsDto {
  @ApiProperty({ example: 'New-York', description: 'name of country and name of city', required: true })
  @IsString({ message: 'Necessary type string' })
  readonly country: string;
  readonly city: string;
}