import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  year: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  engine: string;

  @ApiProperty()
  @IsString()
  size: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}

export class UpdateVehicleDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  year?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  engine?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class ReserveVehicleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsDateString()
  reservedFrom: string;

  @ApiProperty()
  @IsDateString()
  reservedUntil: string;
}

export class VehicleFilterDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  engine?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  year?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search?: string;
}
