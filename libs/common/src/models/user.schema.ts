import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "../database";


@Schema({ versionKey: false })
export class UsersDocument extends AbstractDocument {
  @Prop()
  email!: string;

  @Prop()
  password!: string;

  @Prop()
  roles?: string[];
}

export const UserSchema = SchemaFactory.createForClass(UsersDocument);