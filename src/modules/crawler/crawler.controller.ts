import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../utils/auth/helpers/roles-auth.decorator';
import { RolesGuard } from '../utils/auth/helpers/roles.guard';
import { ICountries } from '../utils/crawlSites/worldPop/interfaces';
import { CrawlerService } from './crawler.service';
import { ScrapeCountryDto } from './dto/scrape.country.dto';

@ApiTags('Crawler')
@Controller('crawler')
export class CrawlerController {
  constructor(private crawlerService: CrawlerService) {}

  @ApiOperation({ summary: 'scrape continents' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('continents')
  scrapeContinents(): Promise<string[]> {
    return this.crawlerService.scrapeContinents();
  }

  @ApiOperation({ summary: 'scrape country by continent' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('country')
  scrapeCountry(@Body() scrapeDto: ScrapeCountryDto): Promise<ICountries[]> {
    const { continent } = scrapeDto;

    return this.crawlerService.scrapeCountry(continent);
  }

  @ApiOperation({ summary: 'crawl all info about country' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('countries/details')
  scrapeInfoAboutCountry(): Promise<boolean> {
    return this.crawlerService.scrapeInfoAboutCountry();
  }

  @ApiOperation({ summary: 'scrape country by continent' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('countries/images')
  scrapeImagesByCountries(): Promise<boolean> {
    return this.crawlerService.scrapeImagesByCountries();
  }
}
