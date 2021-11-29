import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';
//import { ICountriesNumbeo } from './interfaces';

@Injectable()
export class SiteNumbeoService {
  private readonly url = 'https://www.numbeo.com/';
  private readonly SELECT_COUNTRY_URL = 'https://www.numbeo.com/cost-of-living/country_result.jsp?country=';
  private readonly CITY_id = '#city';
  constructor(private crawlerServiceUtil: CrawlerServiceUtils) {}

  async scrapeSite(url: string) {
    await this.crawlerServiceUtil.crawl(url);

    return true;
  }

  async scrapePageCountry(country: string): Promise<Page> {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SELECT_COUNTRY_URL + country + '&displayCurrency=USD');

    return page;
  }

  async scrapeAllCitiesByCountry(country: string) {
    const page = await this.scrapePageCountry(country);
    try {
      const allCities = await page.$$eval(this.CITY_id, (els) =>
        els.map((el) => {
          return el.textContent;
        }),
      );
      const citiesArray = Array.from(allCities);
      const cities = citiesArray[0].split('\n          ');
      cities.shift();
      cities[cities.length - 1] = cities[cities.length - 1].slice(0, cities[cities.length - 1].length - 1);
      return cities;
    } catch (error) {
      await this.crawlerServiceUtil.closePage(page);
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
