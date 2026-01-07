import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Email é brigatório' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Senha é brigatória' })
  @IsString()
  password: string;
}

export class ResLoginDto {
  @ApiProperty()
  @IsString()
  access_token: string;
}
