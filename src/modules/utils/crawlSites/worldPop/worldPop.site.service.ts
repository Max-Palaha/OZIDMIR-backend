import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElementHandle, Page } from 'puppeteer';
import { ICountryUpdatedFields } from 'src/modules/country/interfaces';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';
import { IScrapeCountries, IScrapeContinents, ICountries } from './interfaces';

@Injectable()
export class SiteWorldPopService {
  private readonly SITE_URL: string = 'https://worldpopulationreview.com/';
  private readonly LOCL_CONTINENT: number = 0; // location of continent link
  private readonly CONTINENT_LIST: number = 6;
  private readonly NAVIGATION_ID: string = '#navbarNav a';
  private readonly CONTINENTS_LISTS_ID: string = '.datatable-container tbody';
  private readonly CONTINENT_NAMES_ID: string = 'tr td a';
  // country variables
  private readonly LOCL_COUNTRY: number = 1;
  private readonly COUNTRY_TABLE: string = '#popTable tbody tr';
  private readonly COUNTRY_TABLE_CLASS: string = '.datatable-container tbody';
  private readonly COUNTRY_NAME: string = '.section-container h1';
  private readonly COUNTRY_POPULATION: string = '.center';
  private readonly COUNTRY_ROWVALUE: string = '.rowvalue';
  private readonly COUNTRY_AGE: string = '.median-age p';

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
      const continentElement: ElementHandle<Element> = continentElements[continentIndex];

      await this.crawlerServiceUtil.clickHandler(page, continentElement); // click on current element

      const elementTables: ElementHandle<Element>[] = await page.$$(this.COUNTRY_TABLE_CLASS);
      const countryTableElement: ElementHandle<Element> = elementTables[this.IC];
      const countryElements: ElementHandle<Element>[] = await countryTableElement.$$(this.COUNTRY_RAWS);
      const countries: ICountries[] = await Promise.all(countryElements.map(this.handleCountriesElements.bind(this)));
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

  public async scrapeInfoCountry(): Promise<ICountryUpdatedFields[]> {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SITE_URL);
    try {
      const mainLinks: ElementHandle[] = await page.$$(this.NAVIGATION_ID);

      const countriesLink: ElementHandle<Element> = Array.from(mainLinks)[this.LOCL_COUNTRY];

      await this.crawlerServiceUtil.clickHandler(page, countriesLink);

      const countriesLinks: string[] = await page.$$eval(this.COUNTRY_TABLE, (els) =>
        els.map((el) => el.innerHTML.split('"', 2).pop()),
      );

      const arrayOfCountries: ICountryUpdatedFields[] = [];
      for (const link of countriesLinks) {
        const pageCountry: Page = await this.crawlerServiceUtil.crawl(`${this.SITE_URL}${link}`);

        const name: string = await pageCountry.$eval(this.COUNTRY_NAME, (el) => {
          const nameOfCountry: string[] = el.innerHTML.split(' Population');
          return nameOfCountry[0];
        });

        const { populationRank, capital, subregion, density } = await pageCountry.$$eval(
          this.COUNTRY_ROWVALUE,
          (els) => {
            const populationRank: string = els[0].textContent;
            const density: string = els[7].textContent;
            const capital: string = els[10].textContent;
            const subregion: string = els[12].textContent;
            return {
              populationRank,
              capital,
              subregion,
              density,
            };
          },
        );

        const { medianAge, medianManAge, medianWomanAge } = await pageCountry.$$eval(this.COUNTRY_AGE, (els) => {
          if (els[0]) {
            return {
              medianAge: els[0].textContent,
              medianManAge: els[1].textContent,
              medianWomanAge: els[2].textContent,
            };
          } else {
            return {
              medianAge: null,
              medianManAge: null,
              medianWomanAge: null,
            };
          }
        });

        const population: string = await pageCountry.$eval(this.COUNTRY_POPULATION, (el) => el.textContent);

        arrayOfCountries.push({
          name,
          population,
          populationRank,
          capital,
          density,
          subregion,
          medianAge,
          medianManAge,
          medianWomanAge,
        });
        await this.crawlerServiceUtil.closePage(pageCountry);
      }
      await this.crawlerServiceUtil.closePage(page);

      return arrayOfCountries;
    } catch (error: unknown) {
      await this.crawlerServiceUtil.closePage(page);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async scrapeContinents(page: Page): Promise<IScrapeContinents> {
    try {
      const mainLinks: ElementHandle[] = await page.$$(this.NAVIGATION_ID);
      const continentLink: ElementHandle<Element> = Array.from(mainLinks)[this.LOCL_CONTINENT];

      await this.crawlerServiceUtil.clickHandler(page, continentLink);

      const contentLists: ElementHandle<Element>[] = await page.$$(this.CONTINENTS_LISTS_ID);
      const continentsList: ElementHandle<Element> = Array.from(contentLists)[this.CONTINENT_LIST];
      const continentElements: ElementHandle<Element>[] = await continentsList.$$(this.CONTINENT_NAMES_ID);
      const continents: string[] = await continentsList.$$eval(this.CONTINENT_NAMES_ID, (els) =>
        els.map((el) => el.innerHTML),
      );

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
