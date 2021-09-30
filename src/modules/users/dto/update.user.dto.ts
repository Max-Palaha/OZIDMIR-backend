import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Danylo', description: 'Имя' })
  @IsString({ message: 'Type string needed' })
  readonly firstName?: string;

  @ApiProperty({ example: 'Halytskyy', description: 'Фамилия' })
  @IsString({ message: 'Type string needed' })
  readonly lastName?: string;
}
