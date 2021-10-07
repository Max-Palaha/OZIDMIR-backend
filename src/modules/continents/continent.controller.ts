import { Controller, Get } from '@nestjs/common';
import { ContinentService } from './continent.service';
import { TContinent } from './interfaces';

@Controller('continents')
export class ContinentController {
  constructor(private usersService: ContinentService) {}

  @Get()
  getAll(): Promise<TContinent[]> {
    return this.usersService.getContinents();
  }
}
