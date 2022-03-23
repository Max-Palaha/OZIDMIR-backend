import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'node_modules/rxjs/dist/types';
import { AuthServiceUtils } from '../auth.utils.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // validateUser
  private readonly WRONG_UNAUTHORIZED = 'User not authorized';
  private readonly WRONG_AUTH = 'Wrong email or password';
  private readonly UNKNOWN_ERRROR = 'Unknown error'

  constructor(
    private authServiceUtils: AuthServiceUtils
    ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        throw new HttpException(this.WRONG_UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }

      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new HttpException(this.UNKNOWN_ERRROR, HttpStatus.UNAUTHORIZED);
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
