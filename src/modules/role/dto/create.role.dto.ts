import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUppercase, Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  @IsString({ message: 'Necessary type string' })
  @IsUppercase({ message: 'Name role must be uppercase' })
  readonly name: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  @IsString({ message: 'Necessary type string' })
  @Length(20, 128, { message: 'count of letters less than 20' })
  readonly description: string;
}
