import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IObjectId, mongoObjectId } from 'src/modules/core/mongoose/interfaces';
import { Role } from '../../role/schemas/role.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ example: 'ObjectId', description: 'id' })
  _id: IObjectId;

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

  @ApiProperty({ example: 'hash password', description: 'hash password' })
  @Prop({ type: String, required: true })
  password: string;

  @ApiProperty({ example: 'isActivated', description: 'Activated account' })
  @Prop({ type: Boolean, default: false })
  isActivated: boolean;

  @ApiProperty({ example: 'Link', description: 'Activation Link' })
  @Prop({ type: String })
  activationLink: string;

  @ApiProperty({ example: '/path/id/user', description: 'path of avatar' })
  @Prop({ type: String })
  avatar: string;

  @ApiProperty({ example: 'ObjectId', description: 'RoleId' })
  @Prop({ type: [mongoObjectId], ref: 'Role' })
  roles: Role[];

  @ApiProperty({ example: 'date', description: 'date of creating' })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
