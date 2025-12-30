import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Vehicle', required: true })
  vehicleId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Date, required: true })
  reservedFrom: Date;

  @Prop({ type: Date, required: true })
  reservedUntil: Date;

  @Prop({ default: false })
  cancelled?: boolean;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
