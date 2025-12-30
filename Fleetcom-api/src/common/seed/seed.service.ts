import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import cars from './cars.json';
import { Vehicle } from 'src/vehicle/vehicle.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto } from 'src/vehicle/vehicle.dto';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
    private readonly config: ConfigService,
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<Vehicle>,
  ) {}

  async userAdmin() {
    const email = this.config.get<string>('SEED_USER_EMAIL');
    const password = this.config.get<string>('SEED_USER_PASSWORD');
    const name = this.config.get<string>('SEED_USER_NAME') || 'Admin';

    if (!email || !password || !name) {
      this.logger.log(
        'Credenciais para usuário não encontradas — seed ignorado',
      );
      return;
    }

    const exists = await this.userService.findByEmailToSeed(email);

    if (!exists) {
      await this.userService.create({
        name: name,
        email: email,
        password: password,
        password_confirm: password,
        role: UserRole.ADMIN,
      });

      this.logger.log('Usuário administrador padrão criado com sucesso');
    } else {
      this.logger.log('Usuário admin já existe — seed ignorado');
    }
  }

  async startingCars() {
    const existing = await this.vehicleModel.countDocuments();

    if (existing == 0) {
      await this.vehicleService.insertMany(cars as CreateVehicleDto[]);

      this.logger.log('Veículos iniciais inseridos com sucesso.');
    }
  }
}
