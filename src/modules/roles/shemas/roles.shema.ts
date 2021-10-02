import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RoleDocument = Roles & Document;

@Schema()
export class Roles {
  @ApiProperty({ example: 'ADMIN', description: 'Назва ролі' })
  @Prop()
  value: string;

  @ApiProperty({
    example: 'Адмін',
    description: 'Описання ролі',
  })
  @Prop()
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Roles);
