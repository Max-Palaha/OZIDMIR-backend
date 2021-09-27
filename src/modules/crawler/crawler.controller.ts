import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CrawlerService } from './crawler.service';
import { ScrapeCountryDto } from './dto/scrape.country.dto';
import { ScrapeDto } from './dto/scrape.crawler.dto';

@Controller('crawler')
export class CrawlerController {
  constructor(private crawlerService: CrawlerService) {}

  @ApiOperation({ summary: 'scrape data from any site' })
  @ApiResponse({ status: 200 })
  @Post()
  scrapeContentByUrl(@Body() scrapeDto: ScrapeDto) {
    const { url } = scrapeDto;
    return this.crawlerService.scrapeContent(url);
  }

  @ApiOperation({ summary: 'scrape continents' })
  @ApiResponse({ status: 200 })
  @Post('continents')
  scrapeContinents() {
    return this.crawlerService.scrapeContinents();
  }

  @ApiOperation({ summary: 'scrape country by continent' })
  @ApiResponse({ status: 200 })
  @Post('country')
  scrapeCountry(@Body() scrapeDto: ScrapeCountryDto) {
    const { continent } = scrapeDto;

    return this.crawlerService.scrapeCountry(continent);
  }
}
