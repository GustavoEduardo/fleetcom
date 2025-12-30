import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { CreateUserDto, EditUserDto, ResUserDto } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlink } from 'fs/promises';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria um usuário. (Apenas ADMIN)',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário criado com sucesso',
    type: [ResUserDto],
  })
  @Roles('admin')
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista retornada com sucesso',
    type: [ResUserDto],
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('info')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna as informações do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Sucesso',
    type: [ResUserDto],
  })
  loggedUser(@Req() req: { user: { sub: string } }) {
    return this.userService.findById(req.user.sub);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna um usuário ' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Sucesso',
    type: ResUserDto,
  })
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edita um usuário ',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ type: EditUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário editado com sucesso',
    type: ResUserDto,
  })
  update(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove um usuário  (Apenas ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Sucesso',
  })
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Faz upload de imagem para um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ type: 'file' })
  @ApiResponse({
    status: 200,
    description: 'Sucesso',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/avatars',
        filename: (req, file, callback) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');

    const avatarUrl = `/static/uploads/avatars/${file.filename}`;

    try {
      return await this.userService.update(id, { avatarUrl });
    } catch (err) {
      await unlink(`./public/uploads/avatars/${file.filename}`);
      throw err;
    }
  }
}
