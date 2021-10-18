import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto, UserDto } from './dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { IUser } from './interfaces';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserDto] })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll(): Promise<IUser[]> {
    return this.usersService.getUsers();
  }

  @ApiOperation({ summary: 'Test create user' })
  @ApiResponse({ status: 200, type: Boolean })
  @Post()
  create(@Body() userDto: CreateUserDto): Promise<boolean> {
    return this.usersService.createUser(userDto);
  }
  @Put(':id')
  update(@Body() updateUser: UpdateUserDto, @Param() { id }) {
    return this.usersService.updateUser(id, updateUser);
  }
}
