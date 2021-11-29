import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../utils/auth/helpers/roles-auth.decorator';
import { RolesGuard } from '../utils/auth/helpers/roles.guard';
import { CrawlerService } from './crawler.service';
import { ScrapeCountryDto } from './dto/scrape.country.dto';
import { ScrapeCityDto } from './dto/scrape.city.dto';
import { ScrapeDto } from './dto/scrape.crawler.dto';

@ApiTags('Crawler')
@Controller('crawler')
export class CrawlerController {
  constructor(private crawlerService: CrawlerService) {}

  @ApiOperation({ summary: 'scrape data from any site' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  scrapeContentByUrl(@Body() scrapeDto: ScrapeDto) {
    const { url } = scrapeDto;
    return this.crawlerService.scrapeContent(url);
  }

  @ApiOperation({ summary: 'scrape continents' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('continents')
  scrapeContinents() {
    return this.crawlerService.scrapeContinents();
  }

  @ApiOperation({ summary: 'scrape country by continent' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('country')
  scrapeCountry(@Body() scrapeDto: ScrapeCountryDto) {
    const { continent } = scrapeDto;

    return this.crawlerService.scrapeCountry(continent);
  }

  @ApiOperation({ summary: 'scrape city by country' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @Post('cities')
  scrapeCity(@Body() scrapeDto: ScrapeCityDto) {
    const { country } = scrapeDto;

    return this.crawlerService.scrapeCities(country);
  }
}
