import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CrawlerService } from './crawler.service';
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
}
