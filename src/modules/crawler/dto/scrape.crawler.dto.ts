/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ScrapeDto {
  @ApiProperty({ example: 'ObjectId', description: 'url of site', required: true })
  @IsString({ message: 'Необхідний тип string' })
  readonly url: string;
}
