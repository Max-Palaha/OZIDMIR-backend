import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'ObjectId', description: 'id' })
  readonly id: string;

  @ApiProperty({ example: ['ADMIN', 'USER'], description: 'roles' })
  readonly roles: string[];

  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  readonly email: string;

  @ApiProperty({ example: 'userName', description: 'userName' })
  userName: string;

  @ApiProperty({ example: 'firstName', description: 'firstName' })
  firstName?: string;

  @ApiProperty({ example: 'lastName', description: 'lastName' })
  lastName?: string;

  @ApiProperty({ example: '/path/id', description: 'path of avatar' })
  avatar?: string;

  @ApiProperty({ example: 'date', description: 'date of creating user' })
  createdAt: Date;
}
