/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ScrapeDto {
  @ApiProperty({ example: 'url', description: 'url of site', required: true })
  @IsString({ message: 'Necessary type string' })
  readonly url: string;
}
