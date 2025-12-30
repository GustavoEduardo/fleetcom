import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type VehicleDocument = HydratedDocument<Vehicle>;

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
}

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  engine: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: false })
  imageUrl?: string;

  /** Reserva */

  @Prop({ type: String, enum: VehicleStatus, default: VehicleStatus.AVAILABLE })
  status: VehicleStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', default: null })
  reservedBy: string | null;

  @Prop({ type: Date, default: null })
  reservedFrom: Date | null;

  @Prop({ type: Date, default: null })
  reservedUntil: Date | null;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
