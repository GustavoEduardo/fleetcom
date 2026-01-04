import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleFilterDTO,
  ReserveVehicleDto,
} from './vehicle.dto';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleStatus } from '@prisma/client';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async insertMany(data: CreateVehicleDto[]) {
    return this.prisma.vehicle.createMany({
      data,
    });
  }

  async create(data: CreateVehicleDto) {
    return this.prisma.vehicle.create({ data });
  }

  async update(id: string, data: UpdateVehicleDto) {
    try {
      return await this.prisma.vehicle.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException('Veículo não encontrado');
    }
  }

  async remove(id: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, deletedAt: null },
    });

    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    if (vehicle.status === VehicleStatus.RESERVED) {
      throw new ConflictException(
        'Veículo está reservado e não pode ser removido',
      );
    }

    if (vehicle.imageUrl) {
      const filePath = path.join(
        process.cwd(),
        '..',
        '..',
        'public',
        vehicle.imageUrl.replace('/static/', ''),
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // soft delete
    await this.prisma.vehicle.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Veículo removido' };
  }

  async findAll(filters: VehicleFilterDTO) {
    return this.prisma.vehicle.findMany({
      where: {
        deletedAt: null,
        status: filters.status,
        type: filters.type ? { in: filters.type.split(',') } : undefined,
        year: filters.year ? { in: filters.year.split(',') } : undefined,
        engine: filters.engine ? { in: filters.engine.split(',') } : undefined,
        size: filters.size ? { in: filters.size.split(',') } : undefined,
        name: filters.search
          ? { contains: filters.search, mode: 'insensitive' }
          : undefined,
      },
    });
  }

  async findById(id: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, deletedAt: null },
    });

    if (!vehicle) throw new NotFoundException('Nenhum veículo encontrado');
    return vehicle;
  }

  async reserveVehicle(id: string, dto: ReserveVehicleDto) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, deletedAt: null },
    });

    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    if (vehicle.status === VehicleStatus.RESERVED) {
      throw new ConflictException('Veículo já está reservado no momento');
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        vehicleId: id,
        userId: dto.userId,
        reservedFrom: dto.reservedFrom,
        reservedUntil: dto.reservedUntil,
      },
    });

    const updatedVehicle = await this.prisma.vehicle.update({
      where: { id },
      data: {
        status: VehicleStatus.RESERVED,
        reservedBy: dto.userId,
        reservedFrom: dto.reservedFrom,
        reservedUntil: dto.reservedUntil,
      },
    });

    return {
      message: 'Reserva efetuada com sucesso',
      reservation,
      vehicle: updatedVehicle,
    };
  }

  async releaseVehicle(id: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, deletedAt: null },
    });

    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    if (vehicle.status !== VehicleStatus.RESERVED) {
      throw new BadRequestException('Veículo não está reservado');
    }

    await this.prisma.reservation.updateMany({
      where: {
        vehicleId: id,
        userId: vehicle.reservedBy!,
        returnedAt: null,
      },
      data: { returnedAt: new Date() },
    });

    const updatedVehicle = await this.prisma.vehicle.update({
      where: { id },
      data: {
        status: VehicleStatus.AVAILABLE,
        reservedBy: null,
        reservedFrom: null,
        reservedUntil: null,
      },
    });

    return {
      message: 'Reserva finalizada com sucesso',
      vehicle: updatedVehicle,
    };
  }

  async findReservedByUser(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: {
        vehicle: {
          select: {
            name: true,
            year: true,
            type: true,
            engine: true,
            size: true,
          },
        },
      },
    });
  }

  async getVehicleFilters() {
    const [types, engines, sizes] = await Promise.all([
      this.prisma.vehicle.findMany({
        where: { deletedAt: null },
        distinct: ['type'],
        select: { type: true },
      }),
      this.prisma.vehicle.findMany({
        where: { deletedAt: null },
        distinct: ['engine'],
        select: { engine: true },
      }),
      this.prisma.vehicle.findMany({
        where: { deletedAt: null },
        distinct: ['size'],
        select: { size: true },
      }),
    ]);

    return {
      types: types.map((t) => ({ value: t.type })),
      engines: engines.map((e) => ({ value: e.engine })),
      sizes: sizes.map((s) => ({ value: s.size })),
    };
  }
}
