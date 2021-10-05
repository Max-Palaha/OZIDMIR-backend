import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop([String])
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
