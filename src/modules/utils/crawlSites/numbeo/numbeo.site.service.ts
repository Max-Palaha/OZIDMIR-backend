import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElementHandle, Page } from 'puppeteer';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';

@Injectable()
export class SiteNumbeoService {
  private readonly SITE_URL = 'https://www.numbeo.com/';
  private readonly SELECT_COUNTRY_URL = 'https://www.numbeo.com/cost-of-living/country_result.jsp?country=';
  private readonly CATEGORY_TITLE = '.category_title';
  private readonly DATA_WIDE_TABLE = '.data_wide_table tbody tr';
  constructor(private crawlerServiceUtil: CrawlerServiceUtils) {}

  async scrapeSite(url: string) {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SITE_URL);

    return true;
  }

  async scrapePageCountry(country: string): Promise<Page> {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SELECT_COUNTRY_URL+country+'&displayCurrency=USD');

    return page;
  }

  async scrapeContentCountry(country: string) {
    const page = await this.scrapePageCountry(country);
    try {
      const dataAllTable = await page.$$eval(this.DATA_WIDE_TABLE, (els) => els.map((el) => el.textContent));
      const categoryTitle = await page.$$eval(this.CATEGORY_TITLE, (els) => els.map((el) => el.innerHTML));
      console.log(categoryTitle);
      console.log('!!!!!!!!!!!!!!!!!!!!!');
      console.log(dataAllTable);
      

    } catch (e) {
      //await this.crawlerServiceUtil.closePage(page);
      console.log(e);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return true;
  }

  // function name(el) {
  //   if (!el.getElementsByTagName('th').lenght) {
      
  //   }
  //}
}
