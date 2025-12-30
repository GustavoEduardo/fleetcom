/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './reservation.schema';
import {
  Vehicle,
  VehicleDocument,
  VehicleStatus,
} from '../vehicle/vehicle.schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateReservationDto } from './reservation.dto';
import { VehicleFilterDTO } from 'src/vehicle/vehicle.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<VehicleDocument>,
  ) {}

  async create(data: CreateReservationDto) {
    const { userId, vehicleId, reservedFrom, reservedUntil } = data;

    const now = new Date();

    if (new Date(reservedUntil) <= new Date(reservedFrom)) {
      throw new BadRequestException(
        'A data final deve ser maior que a inicial',
      );
    }

    if (new Date(reservedUntil) <= now) {
      throw new BadRequestException(
        'A data final deve ser maior que a data atual',
      );
    }

    const reservaAtiva = await this.reservationModel.findOne({
      userId,
      cancelled: false,
      reservedUntil: { $gte: now },
    });

    if (reservaAtiva) {
      throw new ConflictException('Usuário já possui uma reserva ativa');
    }

    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    if (vehicle.status === VehicleStatus.RESERVED) {
      throw new ConflictException('Veículo já está reservado');
    }

    // Conflito de período
    const conflict = await this.reservationModel.findOne({
      vehicleId,
      cancelled: false,
      reservedUntil: { $gte: reservedFrom },
      reservedFrom: { $lte: reservedUntil },
    });

    if (conflict) {
      throw new ConflictException(
        'Este veículo já possui uma reserva nesse período',
      );
    }

    const reservation = await this.reservationModel.create(data);

    vehicle.status = VehicleStatus.RESERVED;
    vehicle.reservedBy = userId as string;
    vehicle.reservedFrom = new Date(reservedFrom);
    vehicle.reservedUntil = new Date(reservedUntil);
    await vehicle.save();

    return {
      message: 'Reserva confirmada',
      reservation,
      vehicle,
    };
  }

  async cancel(id: string) {
    const reservation = await this.reservationModel.findById(id);
    if (!reservation) throw new NotFoundException('Reserva não encontrada');

    if (reservation.cancelled)
      throw new ConflictException('Reserva já estava cancelada');

    reservation.cancelled = true;
    await reservation.save();

    // libera veículo
    const vehicle = await this.vehicleModel.findById(reservation.vehicleId);
    if (vehicle) {
      vehicle.status = VehicleStatus.AVAILABLE;
      vehicle.reservedBy = null;
      vehicle.reservedFrom = null;
      vehicle.reservedUntil = null;
      await vehicle.save();
    }

    return {
      message: 'Reserva cancelada com sucesso',
      reservation,
      vehicle,
    };
  }

  async listByUser(userId: string, filters: VehicleFilterDTO) {
    const vehicleMatch: any = {};

    const limit = 30;

    if (filters.status) vehicleMatch.status = filters.status;

    if (filters.year && filters.year.length > 0) {
      vehicleMatch.year = { $in: filters.year.split(',') };
    }

    if (filters.type && filters.type.length > 0) {
      vehicleMatch.type = { $in: filters.type.split(',') };
    }

    if (filters.engine && filters.engine.length > 0) {
      vehicleMatch.engine = { $in: filters.engine.split(',') };
    }

    if (filters.size && filters.size.length > 0) {
      vehicleMatch.size = { $in: filters.size.split(',') };
    }

    if (filters.name) {
      vehicleMatch.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.search) {
      vehicleMatch.name = { $regex: filters.search, $options: 'i' };
    }

    const data = await this.reservationModel
      .find({ userId })
      .populate({
        path: 'vehicleId',
        select: 'name type engine year status imageUrl size',
        match: vehicleMatch,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const filtered = data.filter((r) => r.vehicleId);

    return filtered.map((r) => ({
      ...r,
      vehicle: r.vehicleId,
      vehicleId: undefined,
    }));
  }
}
