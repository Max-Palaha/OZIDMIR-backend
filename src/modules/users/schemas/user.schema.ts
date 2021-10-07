import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Roles } from 'src/modules/roles/shemas/roles.shema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ example: 'ObjectId', description: 'id' })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: 'firstName', description: 'firstName of user' })
  @Prop({ type: String })
  firstName: string;

  @ApiProperty({ example: 'lastName', description: 'lastName of user' })
  @Prop({ type: String })
  lastName: string;

  @ApiProperty({ example: 'email@gmail.com', description: 'email of user' })
  @Prop({ type: String, required: true })
  email: string;

  @ApiProperty({ example: 'username', description: 'username of user' })
  @Prop({ type: String, required: true })
  userName: string;

  @Prop({ type: String, required: true })
  password: string;

  @ApiProperty({ example: '/path/id/user', description: 'path of avatar' })
  @Prop({ type: String })
  avatar: string;

  @ApiProperty({ example: 'ObjectId', description: 'RoleId' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' })
  roles: Roles[];

  @ApiProperty({ example: 'date', description: 'date of creating' })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);