import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContinentService } from './continent.service';
import { TContinent } from './interfaces';

@ApiTags('Continent')
@Controller('continents')
export class ContinentController {
  constructor(private usersService: ContinentService) {}

  @Get()
  getAll(): Promise<TContinent[]> {
    return this.usersService.getContinents();
  }
}
