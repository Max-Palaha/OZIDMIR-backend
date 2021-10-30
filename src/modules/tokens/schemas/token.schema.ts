import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @ApiProperty({ example: 'user', description: 'user' })
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  user: User;

  @ApiProperty({ example: 'refreshToken', description: 'refreshToken' })
  @Prop({ type: String, required: true })
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
