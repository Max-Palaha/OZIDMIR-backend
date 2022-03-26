import { Body, Controller, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/helpers/jwt-auth.guard';
import { Roles } from '@auth/helpers/roles-auth.decorator';
import { RolesGuard } from '@auth/helpers/roles.guard';
import { CreateUserDto, UserDto } from './dto';
import { IUser } from './interfaces';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserDto] })
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAll(): Promise<IUser[]> {
    return this.usersService.getUsers();
  }

  @ApiOperation({ summary: 'Test create user' })
  @ApiResponse({ status: 200, type: Boolean })
  @Post()
  create(@Body() userDto: CreateUserDto): Promise<IUser> {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'upload photo' })
  @ApiResponse({ status: 200 })
  @Patch('/upload/photo')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(@Req() request: Request & { user: IUser }, @UploadedFile() file: Express.Multer.File): Promise<void> {
    return this.usersService.uploadPhoto(file, request.user);
  }
}
