import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, ResLoginDto } from './authLoginDTO';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiOkResponseWrapped } from 'src/common/decorators/api-ok-response.decorator';

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
  @ApiOkResponseWrapped(ResLoginDto)
  login(@Body() data: AuthLoginDto) {
    return this.authService.login(data);
  }
}
