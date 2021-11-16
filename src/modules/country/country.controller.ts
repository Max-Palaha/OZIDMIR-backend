import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { CountryDto } from './dto';
import { ICountry } from './interfaces';

@ApiTags('Country')
@Controller('country')
export class CountryController {
  constructor(private continentService: CountryService) {}

  @ApiOperation({ summary: 'get all countries' })
  @ApiResponse({ status: 200, type: [CountryDto] })
  @Get()
  getAll(): Promise<ICountry[]> {
    return this.continentService.getCountries();
  }
}
