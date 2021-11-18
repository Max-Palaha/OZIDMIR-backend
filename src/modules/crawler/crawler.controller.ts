import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/helpers/roles-auth.decorator';
import { RolesGuard } from '../../helpers/roles.guard';
import { CrawlerService } from './crawler.service';
import { ScrapeContinentDto } from './dto/scrape.continent.dto';
import { ScrapeCountryDto } from './dto/scrape.country.dto'
import { ScrapeDto } from './dto/scrape.crawler.dto';

@ApiTags('Crawler')
@Controller('crawler')
export class CrawlerController {
  constructor(private crawlerService: CrawlerService) {}

  @ApiOperation({ summary: 'scrape data from any site' })
  @ApiResponse({ status: 200 })
  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @Post()
  scrapeContentByUrl(@Body() scrapeDto: ScrapeDto) {
    const { url } = scrapeDto;
    return this.crawlerService.scrapeContent(url);
  }

  @ApiOperation({ summary: 'scrape country by continent(numbeo)' })
  @ApiResponse({ status: 200 })
  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @Post('countrynumb')
  scrapeCountryByName(@Body() scrapeDto: ScrapeCountryDto) {
    const { country } = scrapeDto;

    return this.crawlerService.scrapeContentByName(country);
  }


  @ApiOperation({ summary: 'scrape continents' })
  @ApiResponse({ status: 200 })
  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @Post('continents')
  scrapeContinents() {
    return this.crawlerService.scrapeContinents();
  }

  @ApiOperation({ summary: 'scrape country by continent' })
  @ApiResponse({ status: 200 })
  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  @Post('country')
  scrapeCountryByContinent(@Body() scrapeDto: ScrapeContinentDto) {
    const { continent } = scrapeDto;

    return this.crawlerService.scrapeCountry(continent);
  }
}
