import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UserDto } from './dto';
import { IUser } from './interfaces';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserDto] })
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
