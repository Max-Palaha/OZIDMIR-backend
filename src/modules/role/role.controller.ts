import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleDto, CreateRoleDto } from './dto';
import { RoleService } from './role.service';
import { IRole } from './interfaces';

@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: 'get role' })
  @ApiResponse({ status: 200, type: [RoleDto] })
  @Get()
  getAll(): Promise<IRole[]> {
    return this.roleService.getRoles();
  }

  @ApiOperation({ summary: 'create roles' })
  @ApiResponse({ status: 200, type: Boolean })
  @Post()
  create(@Body() roleDto: CreateRoleDto): Promise<boolean> {
    return this.roleService.createRole(roleDto);
  }
}
