import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './reservation.dto';
import { VehicleStatus } from '@prisma/client';
import { VehicleFilterDTO } from '../vehicle/vehicle.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.$transaction(async (tx) => {
      // usuário já tem reserva ativa?
      const activeReservation = await tx.reservation.findFirst({
        where: {
          userId,
          cancelled: false,
          reservedUntil: { gte: now },
        },
      });

      if (activeReservation) {
        throw new ConflictException('Usuário já possui uma reserva ativa');
      }

      const vehicle = await tx.vehicle.findFirst({
        where: { id: vehicleId, deletedAt: null },
      });

      if (!vehicle) throw new NotFoundException('Veículo não encontrado');

      if (vehicle.status === VehicleStatus.RESERVED) {
        throw new ConflictException('Veículo já está reservado');
      }

      // conflito de período
      const conflict = await tx.reservation.findFirst({
        where: {
          vehicleId,
          cancelled: false,
          reservedUntil: { gte: reservedFrom },
          reservedFrom: { lte: reservedUntil },
        },
      });

      if (conflict) {
        throw new ConflictException(
          'Este veículo já possui uma reserva nesse período',
        );
      }

      const reservation = await tx.reservation.create({
        data: {
          userId: userId || '',
          vehicleId,
          reservedFrom,
          reservedUntil,
        },
      });

      const updatedVehicle = await tx.vehicle.update({
        where: { id: vehicleId },
        data: {
          status: VehicleStatus.RESERVED,
          reservedBy: userId,
          reservedFrom,
          reservedUntil,
        },
      });

      return {
        message: 'Reserva confirmada',
        reservation,
        vehicle: updatedVehicle,
      };
    });
  }

  async cancel(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) throw new NotFoundException('Reserva não encontrada');

      if (reservation.cancelled) {
        throw new ConflictException('Reserva já estava cancelada');
      }

      const updatedReservation = await tx.reservation.update({
        where: { id },
        data: { cancelled: true },
      });

      const vehicle = await tx.vehicle.update({
        where: { id: reservation.vehicleId },
        data: {
          status: VehicleStatus.AVAILABLE,
          reservedBy: null,
          reservedFrom: null,
          reservedUntil: null,
        },
      });

      return {
        message: 'Reserva cancelada com sucesso',
        reservation: updatedReservation,
        vehicle,
      };
    });
  }

  async listByUser(userId: string, filters: VehicleFilterDTO) {
    const limit = 30;

    const reservations = await this.prisma.reservation.findMany({
      where: {
        userId,
        vehicle: {
          deletedAt: null,
          status: filters.status,
          type: filters.type ? { in: filters.type.split(',') } : undefined,
          year: filters.year ? { in: filters.year.split(',') } : undefined,
          engine: filters.engine
            ? { in: filters.engine.split(',') }
            : undefined,
          size: filters.size ? { in: filters.size.split(',') } : undefined,
          name: filters.search
            ? { contains: filters.search, mode: 'insensitive' }
            : undefined,
        },
      },
      include: {
        vehicle: {
          select: {
            name: true,
            type: true,
            engine: true,
            year: true,
            status: true,
            imageUrl: true,
            size: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return reservations;
  }
}
