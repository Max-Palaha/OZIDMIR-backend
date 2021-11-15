import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'node_modules/rxjs/dist/types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private userUnauthorized = 'Користувач не авторизован';

  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: this.userUnauthorized });
      }

      const user = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
      req.user = user;
      

      return user;
    } catch (e) {
      throw new UnauthorizedException({ message: this.userUnauthorized });
    }
  }
}
