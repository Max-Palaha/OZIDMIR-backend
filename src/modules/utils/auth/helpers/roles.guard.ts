import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'node_modules/rxjs/dist/types';
import { ROLES_KEY } from './roles-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly USER_UNAUTHORIZED = 'User not authorized';

  private readonly USER_NO_ACCESS_ROLE = 'The user does not have the appropriate role';

  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException({ message: this.USER_UNAUTHORIZED });
      }

      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: this.USER_UNAUTHORIZED });
      }

      const user = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
      req.user = user;

      if (!requiredRoles) {
        return true;
      }

      if (!user.roles.some((role: string) => requiredRoles.includes(role))) {
        throw new UnauthorizedException({ message: this.USER_NO_ACCESS_ROLE });
      }

      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }
}
