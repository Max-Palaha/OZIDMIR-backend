import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { mongoObjectId, IObjectId } from '../../core/mongoose/interfaces';

export type likesDocument = likes & Document;

@Schema()
export class likes {
  @ApiProperty({ example: 'ObjectId', description: 'id' })
  _id: IObjectId;

  @ApiProperty({ example: 'User`s objectId', description: 'id' })
  @Prop({ type: mongoObjectId, ref: 'User' })
  user: IObjectId;

  @ApiProperty({ example: 'Country`s objectId', description: 'id' })
  @Prop({ type: mongoObjectId, ref: 'Country' })
  country: IObjectId;
}

export const LikesSchema = SchemaFactory.createForClass(likes);
