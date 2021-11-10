import { ApiProperty } from '@nestjs/swagger';
import { Token } from 'src/modules/tokens/schemas/token.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export class AuthDto {
  @ApiProperty({ example: 'token', description: 'jwt token' })
  readonly token: Token;

  @ApiProperty({ example: User, description: 'user data' })
  readonly user: User;
}
