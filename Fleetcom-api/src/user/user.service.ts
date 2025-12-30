/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, EditUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { Reservation } from 'src/reservation/reservation.schema';
import { Vehicle, VehicleStatus } from 'src/vehicle/vehicle.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,

    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<Vehicle>,

    private readonly configService: ConfigService,
  ) {}

  async create(data: CreateUserDto): Promise<Partial<User>> {
    if (data.password !== data.password_confirm) {
      throw new UnprocessableEntityException('As senhas não correspondem');
    }

    const existe = await this.userModel.findOne({ email: data.email });
    if (existe)
      throw new ConflictException('Email já cadastrado para outro usuário');

    const salt = Number(this.configService.get<number>('SALT'));
    data.password = await bcrypt.hash(data.password, salt);

    const newUser = await this.userModel.create(data);
    const { password: _, ...userWithoutPass } = newUser.toObject();
    return userWithoutPass;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Nenhum usuário encontrado');
    return user;
  }

  async findToLogin(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) throw new UnauthorizedException('Usuário ou senha incorretos');
    return user;
  }

  async findByEmailToSeed(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async update(id: string, data: EditUserDto): Promise<User> {
    const user = await this.userModel.findById(id).select('+password');
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.avatarUrl) user.avatarUrl = data.avatarUrl;
    // if (data.role) user.role = data.role; Apenas ADMIN

    // Senha
    if (data.password || data.old_password || data.password_confirm) {
      // Garantir que os três campos foram enviados
      if (!data.old_password || !data.password || !data.password_confirm) {
        throw new BadRequestException(
          'Para mudar a senha envie a nova senha, a confirmação da nova senha e a senha antiga',
        );
      }

      if (data.password !== data.password_confirm) {
        throw new BadRequestException('As senhas não conferem');
      }

      const match = await bcrypt.compare(data.old_password, user.password);
      if (!match) throw new UnauthorizedException('Senha atual incorreta');

      const salt = Number(this.configService.get<number>('SALT'));
      user.password = await bcrypt.hash(data.password, salt);
    }

    return await user.save();
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const reservations = await this.reservationModel.find({
      user: id,
      active: true,
    });

    // Se existir, liberar o veículo reservado antes de excluir usuário
    if (reservations.length > 0) {
      for (const reservation of reservations) {
        const vehicle = await this.vehicleModel.findById(reservation.vehicleId);

        if (vehicle) {
          vehicle.status = VehicleStatus.AVAILABLE;
          vehicle.reservedBy = null;
          vehicle.reservedFrom = null;
          vehicle.reservedUntil = null;
          await vehicle.save();
        }

        reservation.cancelled = true;
        await reservation.save();
      }
    }

    // Remover avatar da pasta pública
    if (user.avatarUrl) {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'public',
        user.avatarUrl.replace('/static/', ''),
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await this.userModel.deleteOne({ _id: id });

    return { message: `Usuário removido` };
  }
}
