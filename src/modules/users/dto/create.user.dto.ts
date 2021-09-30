import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'почта' })
  @IsString({ message: 'Type string needed' })
  @IsEmail({}, { message: 'Type string needed' })
  readonly email: string;

  @ApiProperty({ example: 'qwerty', description: 'пароль' })
  @IsString({ message: 'Type string needed' })
  @Length(8, 128, { message: 'Размер не менее 8' })
  readonly password: string;
}
