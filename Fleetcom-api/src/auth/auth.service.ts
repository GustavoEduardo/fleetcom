import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './authLoginDTO';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(data: AuthLoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.findToLogin(data.email);

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Usuário ou senha incorretos');
    }

    const payload = {
      sub: user.id as string,
      email: user.email,
      nome: user.name,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
