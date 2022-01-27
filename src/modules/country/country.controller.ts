import { Body, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { CountryDto, PaginationParamDto } from './dto';
import { CountriesDto } from './dto/get.countries.dto';
import { ICountry } from './interfaces';

@ApiTags('Country')
@Controller('country')
export class CountryController {
  constructor(private continentService: CountryService) {}

  @ApiOperation({ summary: 'get all countries' })
  @ApiResponse({ status: 200, type: [CountryDto] })
  @Get()
  getCountries(@Body() countriesDto : CountriesDto): Promise<ICountry[]> {
    return this.continentService.getCountries(countriesDto);
  }
}
