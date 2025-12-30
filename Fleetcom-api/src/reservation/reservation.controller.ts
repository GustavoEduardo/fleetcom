import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Req,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './reservation.dto';
import { VehicleFilterDTO } from 'src/vehicle/vehicle.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria uma reserva.',
  })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({
    status: 200,
    description: 'Reserva criada com sucesso',
  })
  create(
    @Body() data: CreateReservationDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.reservationService.create({
      ...data,
      userId: req.user.sub,
    });
  }

  @Patch(':id/cancel')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancela uma reserva',
  })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({
    status: 200,
    description: 'Reserva cancelada com sucesso',
  })
  cancel(@Param('id') id: string) {
    return this.reservationService.cancel(id);
  }

  @Get('/by-user')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lista as reservas de um usuário',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Sucesso',
  })
  listByUser(
    @Req() req: { user: { sub: string } },
    @Query() filters: VehicleFilterDTO,
  ) {
    return this.reservationService.listByUser(req.user.sub, filters);
  }
}
