import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Continent } from 'src/modules/continent/schemas/continent.schema';

export type CountryDocument = Country & Document;

@Schema()
export class Country {
  @ApiProperty({ example: 'ObjectId', description: 'ContinentId' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Continent' })
  continent: Continent;

  @ApiProperty({ example: 'ObjectId', description: 'id' })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: 'Ukraine', description: 'country name' })
  @Prop({ Type: String })
  name: string;

  @ApiProperty({ example: '40000000', description: 'population' })
  @Prop({ Type: String })
  population: string;

  @ApiProperty({ example: '75 per Km^2', description: ' density' })
  @Prop({ Type: String })
  density: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
