import { ApiProperty } from '@nestjs/swagger';

export class CountryDto {
  @ApiProperty({ example: 'ObjectId', description: 'id' })
  readonly id: string;

  @ApiProperty({ example: 'Europe', description: 'name' })
  readonly name: string;
}
