import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'node_modules/rxjs/dist/types';
import { AuthServiceUtils } from '../auth.utils.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // validateUser
  private readonly WRONG_AUTH = 'Wrong email or password';

  constructor(
    private jwtService: JwtService,
    private authServiceUtils: AuthServiceUtils
    ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
      }

      const user = this.authServiceUtils.validateAccessToken(token)
      if(!user){
        throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
      }
      req.user = user;

      return user;
    } catch (e) {
      throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
    }
  }
}
