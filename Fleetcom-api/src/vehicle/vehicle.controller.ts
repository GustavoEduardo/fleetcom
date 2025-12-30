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
  ApiResponse,
} from '@nestjs/swagger';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria um veículo. Regra para Admin [role] ainda não implementada.',
  })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({
    status: 200,
    description: 'Veiculo criado com sucesso',
    type: [CreateVehicleDto],
  })
  create(@Body() data: CreateVehicleDto) {
    return this.vehicleService.create(data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lista todos os veículos',
  })
  @ApiResponse({
    status: 200,
    description: 'Sucesso',
    type: [CreateVehicleDto],
  })
  findAll(@Query() filters: VehicleFilterDTO) {
    return this.vehicleService.findAll(filters);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edita um veículo',
  })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({
    status: 200,
    description: 'Veiculo editado com sucesso',
    type: [CreateVehicleDto],
  })
  update(@Param('id') id: string, @Body() data: UpdateVehicleDto) {
    return this.vehicleService.update(id, data);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove um veículo. (Apenas Admin)',
  })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiResponse({
    status: 200,
    description: 'Removido com sucesso',
  })
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }

  @Post(':id/reserve')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reserva um veículo.',
  })
  @ApiBody({ type: ReserveVehicleDto })
  @ApiResponse({
    status: 200,
    description: 'Veiculo reservado com sucesso',
    type: CreateVehicleDto,
  })
  reserve(@Param('id') id: string, @Body() data: ReserveVehicleDto) {
    return this.vehicleService.reserveVehicle(id, data);
  }

  @Patch(':id/release')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Libera um veículo reservado',
  })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiResponse({
    status: 200,
    description: 'Veículo liberado com sucesso',
    type: CreateVehicleDto,
  })
  release(@Param('id') id: string) {
    return this.vehicleService.releaseVehicle(id);
  }

  @Get('reserved/user/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista os veículos reservados de um usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Sucesso',
    type: [CreateVehicleDto],
  })
  findReservedByUser(@Param('userId') userId: string) {
    return this.vehicleService.findReservedByUser(userId);
  }

  @Post(':id/image')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Faz upload de imagem para um veículo' })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiBody({ type: 'file' })
  @ApiResponse({
    status: 200,
    description: 'Sucesso',
  })
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
  getVehicleFilters() {
    return this.vehicleService.getVehicleFilters();
  }
}
