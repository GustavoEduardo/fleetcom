import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsUUID, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty()
  @IsUUID()
  vehicleId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty()
  @IsDateString()
  reservedFrom: string;

  @ApiProperty()
  @IsDateString()
  reservedUntil: string;
}

export class UpdateReservationDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  cancelled?: boolean;
}

export class ResReservationDto {
  @ApiProperty()
  @IsUUID()
  vehicleId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty()
  @IsDateString()
  reservedFrom: string;

  @ApiProperty()
  @IsDateString()
  reservedUntil: string;
}
