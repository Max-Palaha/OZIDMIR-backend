import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "node_modules/rxjs/dist/types";


export class JwtAuthGuard implements CanActivate{
    constructor(private jwtService: JwtService,private userUnauthorized:'Користувач не авторизован'){

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        try{
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            if (bearer !== 'Bearer' || !token){
                throw new UnauthorizedException({message:this.userUnauthorized});
            }

            const user = this.jwtService.verify(token);
            req.user = user;
            return user;
        } catch (e){
            console.log(e);
            throw new UnauthorizedException({message:this.userUnauthorized});
        }
    }
}