import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Continent } from 'src/modules/continent/schemas/continent.schema';

export type CountryDocument = Country & Document;

@Schema()
export class Country {
  @ApiProperty({ example: 'ObjectId', description: 'id' })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: 'Austria', description: 'name of country' })
  @Prop({ Type: String })
  name: string;

  @ApiProperty({ example: '124276978', description: 'population' })
  @Prop({ Type: String })
  population: string;

  @ApiProperty({ example: '121', description: 'density' })
  @Prop({ Type: String })
  density: string;

  @ApiProperty({ example: 'Europe', description: 'name of country' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Continent' })
  continent: Continent;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
