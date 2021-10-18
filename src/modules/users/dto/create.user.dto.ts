import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  @IsString({ message: 'Necessary type string' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;

  @ApiProperty({ example: '12345678', description: 'password' })
  @IsString({ message: 'Necessary type string' })
  @Length(8, 128, { message: 'Length less than 8' })
  readonly password: string;
}
