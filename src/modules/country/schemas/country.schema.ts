import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Continent } from '../../continent/schemas/continent.schema';
import { mongoObjectId, IObjectId } from '@core/mongoose/interfaces';

export type CountryDocument = Country & Document;

@Schema()
export class Country {
  @ApiProperty({ example: 'ObjectId', description: 'id' })
  _id: IObjectId;

  @ApiProperty({ example: 'Austria', description: 'name of country' })
  @Prop({ Type: String })
  name: string;

  @ApiProperty({ example: '124276978', description: 'population' })
  @Prop({ Type: String })
  population: string;

  @ApiProperty({ example: 'path of image AWS', description: 'image of country' })
  @Prop({ Type: String })
  image: string;

  @ApiProperty({ example: '121', description: 'density' })
  @Prop({ Type: String })
  density: string;

  @ApiProperty({ example: 'Europe', description: 'name of country' })
  @Prop({ type: mongoObjectId, ref: 'Continent' })
  continent: Continent;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
