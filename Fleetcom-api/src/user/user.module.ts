import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {
  Reservation,
  ReservationSchema,
} from 'src/reservation/reservation.schema';
import { Vehicle, VehicleSchema } from 'src/vehicle/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Reservation.name, schema: ReservationSchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
