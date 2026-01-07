import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: '2026-01-07T16:06:26.370Z' })
  timestamp: string;

  @ApiProperty({ example: 'Operação realizada com sucesso' })
  message: boolean;

  @ApiProperty({ example: { id: '', name: '' } })
  data: T;
}
