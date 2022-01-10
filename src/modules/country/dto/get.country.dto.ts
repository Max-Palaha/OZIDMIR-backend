import { ApiProperty } from '@nestjs/swagger';

export class CountryDto {
  @ApiProperty({ example: 'ObjectId', description: 'ContinentId' })
  readonly continent: string;

  @ApiProperty({ example: 'ObjectId', description: 'id' })
  readonly id: string;

  @ApiProperty({ example: 'Ukraine', description: 'country name' })
  readonly name: string;

  @ApiProperty({ example: '1000000', description: 'population' })
  readonly population: string;

  @ApiProperty({ example: '75 per Km^2', description: 'density' })
  readonly density: string;
}
