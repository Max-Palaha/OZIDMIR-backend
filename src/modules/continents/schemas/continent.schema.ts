import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type ContinentDocument = Continent & Document;

@Schema()
export class Continent {
  @ApiProperty({
    example: 'ObjectId',
    description: 'id',
  })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: 'Europe', description: 'name of continent' })
  @Prop({ Type: String })
  name: string;
}

export const ContinentSchema = SchemaFactory.createForClass(Continent);
