import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ResUserDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty()
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;
}
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Nome é brigatório' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Senha é brigatória' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  @IsString()
  password_confirm: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email é brigatório' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty()
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;
}
export class EditUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  old_password?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password_confirm?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}
