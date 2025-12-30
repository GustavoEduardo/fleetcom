import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { SeedService } from './seed.service';
import { VehicleModule } from 'src/vehicle/vehicle.module';

@Module({
  imports: [UserModule, VehicleModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.userAdmin();
    await this.seedService.startingCars();
  }
}
