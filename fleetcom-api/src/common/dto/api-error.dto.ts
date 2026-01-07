import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: '2026-01-07T16:06:26.370Z' })
  timestamp: string;

  @ApiProperty({ example: 'Veículo não encontrado' })
  message: string;

  @ApiProperty({ example: 'NotFoundException' })
  error: string;
}
