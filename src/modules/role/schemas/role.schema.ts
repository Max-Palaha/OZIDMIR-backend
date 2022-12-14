import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @ApiProperty({ example: 'ObjectId', description: 'id' })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: 'ADMIN', description: 'Назва ролі' })
  @Prop()
  name: string;

  @ApiProperty({
    example: 'Адмін',
    description: 'Описання ролі',
  })
  @Prop()
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
