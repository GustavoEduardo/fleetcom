import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Endpoint para teste do status da API',
  })
  @ApiResponse({
    status: 200,
    description: 'Working',
  })
  getHello() {
    return this.appService.getHello();
  }
}
