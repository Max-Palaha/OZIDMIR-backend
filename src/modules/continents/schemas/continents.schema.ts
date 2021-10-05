import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ContinentDocument = Continent & Document;

@Schema()
export class Continent {
  @ApiProperty({ example: 'Europe', description: 'name of continent' })
  @Prop({ Type: String })
  name: string;
}

export const ContinentSchema = SchemaFactory.createForClass(Continent);
