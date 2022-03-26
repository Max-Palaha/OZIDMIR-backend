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
import { Request } from 'express';
import { IUser } from 'src/modules/users/interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly USER_UNAUTHORIZED: string = 'User not authorized';

  private readonly USER_NO_ACCESS_ROLE: string = 'The user does not have the appropriate role';

  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles: string[] = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      const req: Request & { user: IUser } = context.switchToHttp().getRequest();
      const authHeader: string = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException({ message: this.USER_UNAUTHORIZED });
      }

      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: this.USER_UNAUTHORIZED });
      }

      const user: IUser = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
      req.user = user;

      if (!requiredRoles) {
        return true;
      }

      if (!user.roles.some((role: string) => requiredRoles.includes(role))) {
        throw new UnauthorizedException({ message: this.USER_NO_ACCESS_ROLE });
      }

      return true;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }
}