import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/schemas/user.schema';

export class AuthDto {
  @ApiProperty({ example: 'token', description: 'jwt token' })
  readonly token: string;

  @ApiProperty({ example: User, description: 'user data' })
  readonly user: User;
}
