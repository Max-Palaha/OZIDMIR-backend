import { ApiProperty } from '@nestjs/swagger';
import { Token } from '../../tokens/schemas/token.schema';
import { User } from '../../users/schemas/user.schema';

export class AuthDto {
  @ApiProperty({ example: 'token', description: 'jwt token' })
  readonly token: Token;

  @ApiProperty({ example: User, description: 'user data' })
  readonly user: User;
}
