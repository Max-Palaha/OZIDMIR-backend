import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create.roles.dto';
import { RolesService } from './roles.service';

@ApiTags('Role')
@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get()
  getAll() {
    return this.roleService.getAllRoles();
  }

  @Post()
  create(@Body() roleDto: CreateRoleDto) {
    return this.roleService.createRole(roleDto);
  }
}
