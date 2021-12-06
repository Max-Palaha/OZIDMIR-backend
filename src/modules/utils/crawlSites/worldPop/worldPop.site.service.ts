import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElementHandle, Page } from 'puppeteer';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';
import { IScrapeCountries, IScrapeContinents, ICountries } from './interfaces';

@Injectable()
export class SiteWorldPopService {
  private readonly SITE_URL = 'https://worldpopulationreview.com/';
  private readonly LOCL = 0; // location of continent link
  private readonly CONTINENT_LIST = 6;
  private readonly NAVIGATION_ID = '#navbarNav a';
  private readonly CONTINENTS_LISTS_ID = '.table-container tbody';
  private readonly CONTINENT_NAMES_ID = 'tr td a';
  // country variables
  private readonly COUNTRY_TABLE_CLASS = '.table-container tbody';
  private readonly COUNTRY_RAWS = 'tr';
  private readonly IC = 0; // country index of table in array
  constructor(private crawlerServiceUtil: CrawlerServiceUtils) {}

  public async scrapePageContinents(): Promise<IScrapeContinents> {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SITE_URL);
    try {
      const continentsObj = await this.scrapeContinents(page);
      await this.crawlerServiceUtil.closePage(page);

      return continentsObj;
    } catch (error) {
      await this.crawlerServiceUtil.closePage(page);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async scrapeCountryByContinent(continent: string): Promise<IScrapeCountries> {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SITE_URL);
    try {
      const { continentElements, continents } = await this.scrapeContinents(page);
      const continentIndex = continents.indexOf(continent);
      // continentIndex === -1
      if (!~continentIndex) {
        throw new HttpException('Incorrect name of continent', HttpStatus.NO_CONTENT);
      }

      const continentElement = continentElements[continentIndex];

      await this.crawlerServiceUtil.clickHandler(page, continentElement); // click on current element

      const elementTables = await page.$$(this.COUNTRY_TABLE_CLASS);

      const countryTableElement = elementTables[this.IC];
      const countryElements = await countryTableElement.$$(this.COUNTRY_RAWS);
      const countries = await Promise.all(<ICountries[]>countryElements.map(this.handleCountriesElements.bind(this)));
      await this.crawlerServiceUtil.closePage(page);

      return {
        countries,
        countryElements,
        continent,
      };
    } catch (error) {
      await this.crawlerServiceUtil.closePage(page);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async scrapeContinents(page: Page) {
    try {
      const mainLinks: ElementHandle[] = await page.$$(this.NAVIGATION_ID);

      const continentLink = Array.from(mainLinks)[this.LOCL];
      
      await this.crawlerServiceUtil.clickHandler(page, continentLink);

      const contentLists = await page.$$(this.CONTINENTS_LISTS_ID);
      const continentsList = Array.from(contentLists)[this.CONTINENT_LIST];
      const continentElements = await continentsList.$$(this.CONTINENT_NAMES_ID);
      const continents = await continentsList.$$eval(this.CONTINENT_NAMES_ID, (els) => els.map((el) => el.innerHTML));

      return {
        continents: Array.from(continents),
        continentElements: continentElements,
      };
    } catch (error) {
      await this.crawlerServiceUtil.closePage(page);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async handleCountriesElements(elCountry: ElementHandle<Element>): Promise<ICountries> {
    const countryData: string = await this.crawlerServiceUtil.getProperty(elCountry, 'innerText');
    const [name, population, density] = countryData.split('\t');

    return {
      name,
      population,
      density,
    };
  }
}
