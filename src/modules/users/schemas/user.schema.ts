import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  displayName?: string;

  @Prop()
  gender?: string;

  @Prop()
  birthDate?: Date;

  @Prop()
  horoscopeSign?: string;

  @Prop()
  zodiacSign?: string;

  @Prop()
  height?: number;

  @Prop()
  weight?: number;

  @Prop()
  interests?: string[];

  @Prop()
  profilePicture?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
