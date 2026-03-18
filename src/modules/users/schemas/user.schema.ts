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

  @Prop({ default: null })
  displayName?: string;

  @Prop({ default: null })
  gender?: string;

  @Prop({ default: null })
  birthDate?: Date;

  @Prop({ default: null })
  horoscopeSign?: string;

  @Prop({ default: null })
  zodiacSign?: string;

  @Prop({ default: null })
  height?: number;

  @Prop({ default: null })
  weight?: number;

  @Prop({ default: null })
  interests?: string[];

  @Prop({ default: null })
  profilePicture?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
