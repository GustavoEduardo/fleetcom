import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty()
  @IsMongoId()
  vehicleId: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
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
