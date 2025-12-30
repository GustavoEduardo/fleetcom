import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Vehicle, VehicleStatus } from './vehicle.schema';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleFilterDTO,
  ReserveVehicleDto,
} from './vehicle.dto';
import { Reservation } from 'src/reservation/reservation.schema';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
  ) {}

  async insertMany(data: CreateVehicleDto[]) {
    return await this.vehicleModel.insertMany(data);
  }

  async create(data: CreateVehicleDto) {
    return await this.vehicleModel.create(data);
  }

  async update(id: string, data: UpdateVehicleDto) {
    const vehicle = await this.vehicleModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');
    return vehicle;
  }

  async remove(id: string) {
    const vehicle = await this.vehicleModel.findById(id);
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    if (vehicle.status === VehicleStatus.RESERVED) {
      throw new ConflictException(
        'Veículo está reservado e não pode ser removido',
      );
    }

    if (vehicle.imageUrl) {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'public',
        vehicle.imageUrl.replace('/static/', ''),
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await this.vehicleModel.findByIdAndDelete(id);
    return { message: 'Veículo removido permanentemente' };
  }

  async findAll(filters: VehicleFilterDTO) {
    const query: FilterQuery<Vehicle> = {};

    if (filters.status) query.status = filters.status;

    if (filters.type && filters.type.length > 0) {
      query.type = { $in: filters.type.split(',') };
    }

    if (filters.status) query.status = filters.status;

    if (filters.year && filters.year.length > 0) {
      query.year = { $in: filters.year.split(',') };
    }

    if (filters.type && filters.type.length > 0) {
      query.type = { $in: filters.type.split(',') };
    }

    if (filters.engine && filters.engine.length > 0) {
      query.engine = { $in: filters.engine.split(',') };
    }

    if (filters.size && filters.size.length > 0) {
      query.size = { $in: filters.size.split(',') };
    }

    if (filters.name) {
      query.name = {
        $regex: filters.name,
        $options: 'i',
      };
    }

    if (filters.search) {
      query.name = {
        $regex: filters.search,
        $options: 'i',
      };
    }

    return this.vehicleModel.find(query).exec();
  }

  async findById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleModel.findById(id);
    if (!vehicle) throw new NotFoundException('Nenhum veículo encontrado');
    return vehicle;
  }

  async reserveVehicle(id: string, dto: ReserveVehicleDto) {
    const vehicle = await this.vehicleModel.findById(id);
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    if (vehicle.status === VehicleStatus.RESERVED) {
      throw new ConflictException('Veículo já está reservado no momento');
    }

    const reservation = await this.reservationModel.create({
      vehicle: id,
      user: dto.userId,
      reservedFrom: dto.reservedFrom,
      reservedUntil: dto.reservedUntil,
    });

    vehicle.status = VehicleStatus.RESERVED;
    vehicle.reservedBy = dto.userId;
    vehicle.reservedFrom = reservation.reservedFrom;
    vehicle.reservedUntil = reservation.reservedUntil;
    await vehicle.save();

    return { message: 'Reserva efetuada com sucesso', reservation, vehicle };
  }

  async releaseVehicle(id: string) {
    const vehicle = await this.vehicleModel.findById(id);
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    if (vehicle.status !== VehicleStatus.RESERVED) {
      throw new BadRequestException('Veículo não está reservado');
    }

    await this.reservationModel.updateOne(
      { vehicle: id, user: vehicle.reservedBy, returnedAt: null },
      { returnedAt: new Date() },
    );

    vehicle.status = VehicleStatus.AVAILABLE;
    vehicle.reservedBy = null;
    vehicle.reservedFrom = null;
    vehicle.reservedUntil = null;
    await vehicle.save();

    return { message: 'Reserva finalizada com sucesso', vehicle };
  }

  async findReservedByUser(userId: string) {
    return this.reservationModel
      .find({ user: userId })
      .populate('vehicle', 'name year type engine size');
  }

  async getVehicleFilters(): Promise<any> {
    return await this.vehicleModel.aggregate([
      {
        $facet: {
          types: [
            { $group: { _id: '$type' } },
            { $project: { _id: 0, value: '$_id' } },
          ],
          engines: [
            { $group: { _id: '$engine' } },
            { $project: { _id: 0, value: '$_id' } },
          ],
          sizes: [
            { $group: { _id: '$size' } },
            { $project: { _id: 0, value: '$_id' } },
          ],
        },
      },
    ]);
  }
}
