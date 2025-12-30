import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './authLoginDTO';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Faz o login. Aitenticação JWT',
  })
  @ApiBody({ type: AuthLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário criado com sucesso',
  })
  login(@Body() data: AuthLoginDto) {
    return this.authService.login(data);
  }
}
