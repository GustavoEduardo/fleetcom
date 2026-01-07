import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  ReserveVehicleDto,
  VehicleFilterDTO,
} from './vehicle.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { ApiOkResponseWrapped } from 'src/common/decorators/api-ok-response.decorator';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria um veículo. (Admin)',
  })
  @ApiBody({ type: CreateVehicleDto })
  @ApiOkResponseWrapped(CreateVehicleDto, { isArray: true })
  create(@Body() data: CreateVehicleDto) {
    return this.vehicleService.create(data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lista todos os veículos',
  })
  @ApiOkResponseWrapped(CreateVehicleDto, { isArray: true })
  findAll(@Query() filters: VehicleFilterDTO) {
    return this.vehicleService.findAll(filters);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edita um veículo. (Admin)',
  })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiOkResponseWrapped(CreateVehicleDto)
  update(@Param('id') id: string, @Body() data: UpdateVehicleDto) {
    return this.vehicleService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove um veículo. (Admin)',
  })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiOkResponseWrapped(CreateVehicleDto)
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }

  @Post(':id/reserve')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reserva um veículo.',
  })
  @ApiBody({ type: ReserveVehicleDto })
  @ApiOkResponseWrapped(CreateVehicleDto)
  reserve(@Param('id') id: string, @Body() data: ReserveVehicleDto) {
    return this.vehicleService.reserveVehicle(id, data);
  }

  @Patch(':id/release')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Libera um veículo reservado',
  })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiOkResponseWrapped(CreateVehicleDto)
  release(@Param('id') id: string) {
    return this.vehicleService.releaseVehicle(id);
  }

  @Get('reserved/user/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista os veículos reservados de um usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiOkResponseWrapped(CreateVehicleDto, { isArray: true })
  findReservedByUser(@Param('userId') userId: string) {
    return this.vehicleService.findReservedByUser(userId);
  }

  @Post(':id/image')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Faz upload de imagem para um veículo' })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiBody({ type: 'file' })
  @ApiOkResponseWrapped(CreateVehicleDto)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/vehicles',
        filename: (req, file, callback) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadVehicleImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');

    const vehicle = await this.vehicleService.findById(id);
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    const imageUrl = `/static/uploads/vehicles/${file.filename}`;

    return this.vehicleService.update(id, { imageUrl });
  }

  @Get('filters')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista os possíveis filtros para os veículos' })
  @ApiOkResponseWrapped(CreateVehicleDto)
  getVehicleFilters() {
    return this.vehicleService.getVehicleFilters();
  }
}
