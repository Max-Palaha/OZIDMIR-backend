import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElementHandle, Page } from 'puppeteer';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';
import { IScrapeCountries, IScrapeContinents, ICountries } from './interfaces';

@Injectable()
export class SiteWorldPopService {
  private readonly SITE_URL: string = 'https://worldpopulationreview.com/';
  private readonly LOCL: number = 0; // location of continent link
  private readonly CONTINENT_LIST: number = 6;
  private readonly NAVIGATION_ID: string = '#navbarNav a';
  private readonly CONTINENTS_LISTS_ID: string = '.table-container tbody';
  private readonly CONTINENT_NAMES_ID: string = 'tr td a';
  // country variables
  private readonly COUNTRY_TABLE_CLASS: string = '.table-container tbody';
  private readonly COUNTRY_RAWS: string = 'tr';
  private readonly IC: number = 0; // country index of table in array
  constructor(private crawlerServiceUtil: CrawlerServiceUtils) {}

  public async scrapePageContinents(): Promise<IScrapeContinents> {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SITE_URL);
    try {
      const continentsObj: IScrapeContinents = await this.scrapeContinents(page);
      await this.crawlerServiceUtil.closePage(page);

      return continentsObj;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async scrapeCountryByContinent(continent: string): Promise<IScrapeCountries> {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SITE_URL);
    try {
      const { continentElements, continents } = await this.scrapeContinents(page);
      const continentIndex: number = continents.indexOf(continent);
      // continentIndex === -1
      if (!~continentIndex) {
        throw new HttpException('Incorrect name of continent', HttpStatus.NO_CONTENT);
      }

      const continentElement = continentElements[continentIndex];

      await this.crawlerServiceUtil.clickHandler(page, continentElement); // click on current element

      const elementTables = await page.$$(this.COUNTRY_TABLE_CLASS);

      const countryTableElement = elementTables[this.IC];
      const countryElements = await countryTableElement.$$(this.COUNTRY_RAWS);
      const countries: ICountries[] = (await Promise.all(
        countryElements.map(this.handleCountriesElements.bind(this)),
      )) as ICountries[];
      await this.crawlerServiceUtil.closePage(page);

      return {
        countries,
        countryElements,
        continent,
      };
    } catch (error: unknown) {
      await this.crawlerServiceUtil.closePage(page);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async scrapeContinents(page: Page): Promise<IScrapeContinents> {
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
    } catch (error: unknown) {
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
