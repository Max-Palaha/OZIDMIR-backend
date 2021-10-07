import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContinentService } from './continent.service';
import { ContinentDto } from './dto';
import { TContinent } from './interfaces';

@ApiTags('Continent')
@Controller('continents')
export class ContinentController {
  constructor(private continentService: ContinentService) {}

  @ApiOperation({ summary: 'get all continents' })
  @ApiResponse({ status: 200, type: [ContinentDto] })
  @Get()
  getAll(): Promise<TContinent[]> {
    return this.continentService.getContinents();
  }
}
