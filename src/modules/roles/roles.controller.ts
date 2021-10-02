import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRoleDto } from './roles.dto';
import { RolesService } from './roles.service';

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
