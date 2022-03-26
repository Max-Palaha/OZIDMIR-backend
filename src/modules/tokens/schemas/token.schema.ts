import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { IObjectId, mongoObjectId } from '@core/mongoose/interfaces';
import { User } from '../../users/schemas/user.schema';

export type TokenDocument = Token & mongoose.Document;

@Schema()
export class Token {
  @ApiProperty({ example: 'ObjectId', description: 'id' })
  _id: IObjectId;

  @ApiProperty({ example: 'user', description: 'user' })
  @Prop({ type: mongoObjectId, ref: 'User' })
  user: User;

  @ApiProperty({ example: 'refreshToken', description: 'refreshToken' })
  @Prop({ type: String, required: true })
  refreshToken: string;
}

export const TokenSchema: mongoose.Schema<TokenDocument> = SchemaFactory.createForClass(Token);
