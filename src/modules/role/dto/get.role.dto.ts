import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({ example: 'ObjectId', description: 'id' })
  readonly id: string;

  @ApiProperty({ example: 'ADMIN', description: 'name of role' })
  readonly name: string;

  @ApiProperty({ example: 'this role has limited functional', description: 'description' })
  readonly description: string;
}
