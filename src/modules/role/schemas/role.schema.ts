import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IObjectId } from '../../core/mongoose/interfaces';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @ApiProperty({ example: 'ObjectId', description: 'id' })
  _id: IObjectId;

  @ApiProperty({ example: 'ADMIN', description: 'Name of role' })
  @Prop()
  name: string;

  @ApiProperty({
    example: 'all rules',
    description: 'Description of role',
  })
  @Prop()
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
