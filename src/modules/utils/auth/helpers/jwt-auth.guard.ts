import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'node_modules/rxjs/dist/types';
import { Request } from 'express';
import { AuthServiceUtils } from '../auth.utils.service';
import { IUser } from 'src/modules/users/interfaces';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // validateUser
  private readonly WRONG_UNAUTHORIZED: string = 'User not authorized';
  private readonly WRONG_AUTH: string = 'Wrong email or password';
  private readonly UNKNOWN_ERRROR: string = 'Unknown error';

  constructor(private authServiceUtils: AuthServiceUtils) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request & { user: IUser } = context.switchToHttp().getRequest();

    try {
      const authHeader: string = req.headers.authorization;

      if (!authHeader) {
        throw new HttpException(this.WRONG_UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }

      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new HttpException(this.UNKNOWN_ERRROR, HttpStatus.UNAUTHORIZED);
      }

      const user: IUser = this.authServiceUtils.validateAccessToken(token);
      if (!user) {
        throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
      }
      req.user = user;

      return true;
    } catch (e: unknown) {
      throw new HttpException(this.WRONG_AUTH, HttpStatus.UNAUTHORIZED);
    }
  }
}
