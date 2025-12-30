import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/user.schema';

interface RequestUser {
  sub: string;
  email: string;
  nome: string;
  role: UserRole;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest<{ user: RequestUser }>();
    const user = req.user;

    if (!user) throw new ForbiddenException('Usuário não autenticado');

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota',
      );
    }

    return true;
  }
}
