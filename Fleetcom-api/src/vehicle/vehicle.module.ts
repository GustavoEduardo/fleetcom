import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { Vehicle, VehicleSchema } from './vehicle.schema';
import {
  Reservation,
  ReservationSchema,
} from 'src/reservation/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [
    VehicleService,
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]), // usado no seed
  ],
})
export class VehicleModule {}
