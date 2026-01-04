import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto, EditUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { VehicleStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(data: CreateUserDto) {
    if (data.password !== data.password_confirm) {
      throw new UnprocessableEntityException('As senhas não correspondem');
    }

    const existe = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        deletedAt: null,
      },
    });

    if (existe) {
      throw new ConflictException('Email já cadastrado para outro usuário');
    }

    const salt = Number(this.configService.get<number>('SALT'));
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        avatarUrl: data.avatarUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) throw new NotFoundException('Nenhum usuário encontrado');
    return user;
  }

  async findToLogin(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        name: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário ou senha incorretos');
    }

    return user;
  }

  async update(id: string, data: EditUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    // troca de senha
    if (data.password || data.old_password || data.password_confirm) {
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
      data.password = await bcrypt.hash(data.password, salt);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl,
        password: data.password,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    // Buscar reservas ativas
    const reservations = await this.prisma.reservation.findMany({
      where: {
        userId: id,
        cancelled: false,
      },
    });

    for (const reservation of reservations) {
      await this.prisma.vehicle.update({
        where: { id: reservation.vehicleId },
        data: {
          status: VehicleStatus.AVAILABLE,
          reservedBy: null,
          reservedFrom: null,
          reservedUntil: null,
        },
      });

      await this.prisma.reservation.update({
        where: { id: reservation.id },
        data: { cancelled: true },
      });
    }

    // remover avatar
    if (user.avatarUrl) {
      const filePath = path.join(
        process.cwd(),
        '..',
        '..',
        'public',
        user.avatarUrl.replace('/static/', ''),
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // soft delete
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Usuário removido' };
  }
}
