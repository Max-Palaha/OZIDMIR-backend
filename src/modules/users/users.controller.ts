import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto, UserDto } from './dto';
import { IUser } from './interfaces';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserDto] })
  //@Roles("ADMIN")
  //@UseGuards(RolesGuard)
  @Get()
  getAll(): Promise<IUser[]> {
    return this.usersService.getUsers();
  }

  @ApiOperation({ summary: 'Test create user' })
  @ApiResponse({ status: 200, type: Boolean })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }
}
