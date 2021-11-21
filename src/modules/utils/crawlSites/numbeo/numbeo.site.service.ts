import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElementHandle, Page } from 'puppeteer';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';
import { ICountriesNumbeo } from './interfaces';

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
      const dataAllTable = await page.$$eval(this.DATA_WIDE_TABLE, (els) => els.map((el) => {
        if (el.getElementsByTagName('th').length) {
          return el.querySelector('div').innerHTML; 
        } else {
          const productName = el.querySelector('td').innerHTML;
          const productPrice = el.querySelector('td').nextElementSibling.textContent;
          return {
            name: productName,
            price: productPrice
          }
        }
      }));

      const dataTable = [];
      let nameHeader;
      for (let i in dataAllTable) {
        if (typeof dataAllTable[i] === 'string') {
          nameHeader = dataAllTable[i];
          dataTable[nameHeader] = [];
        } else {
          dataTable[nameHeader].push(dataAllTable[i])
        }
      }      
      console.log(dataTable);
      
      return dataTable;

    } catch (e) {
      await this.crawlerServiceUtil.closePage(page);
      console.log(e);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
