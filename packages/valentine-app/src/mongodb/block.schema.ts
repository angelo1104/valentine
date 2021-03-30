import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BlockDocument = Block & Document;

@Schema()
export class Block {
  @Prop({ required: true })
  index: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: JSON;

  @Prop({ required: true })
  nonce: number;

  @Prop({ required: true })
  timestamp: number;

  @Prop({ required: true })
  prevHash: string;

  @Prop({ required: true })
  difficulty: number;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
