import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElementHandle, Page } from 'puppeteer';
import { CountryService } from 'src/modules/country/country.service';
import { ICountry, ICountryUpdatedFields } from 'src/modules/country/interfaces';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';
import { IScrapeCountries, IScrapeContinents, ICountries } from './interfaces';

@Injectable()
export class SiteWorldPopService {
  private readonly SITE_URL = 'https://worldpopulationreview.com/';
  private readonly LOCL_CONTINENT = 0; // location of continent link
  private readonly CONTINENT_LIST = 6;
  private readonly NAVIGATION_ID = '#navbarNav a';
  private readonly CONTINENTS_LISTS_ID = '.datatable-container tbody';
  private readonly CONTINENT_NAMES_ID = 'tr td a';
  // country variables
  private readonly LOCL_COUNTRY = 1;
  private readonly COUNTRY_TABLE = '#popTable tbody tr';
  private readonly COUNTRY_TABLE_CLASS = '.datatable-container tbody';
  private readonly COUNTRY_NAME = '.section-container h1';
  private readonly COUNTRY_POPULATION = '.center';
  private readonly COUNTRY_ROWVALUE = '.rowvalue';
  private readonly COUNTRY_AGE = '.median-age p';

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

  public async scrapeInfoCountry() {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SITE_URL);
    try {
      const mainLinks: ElementHandle[] = await page.$$(this.NAVIGATION_ID);

      const countriesLink = Array.from(mainLinks)[this.LOCL_COUNTRY];

      await this.crawlerServiceUtil.clickHandler(page, countriesLink);

      const countriesLinks = await page.$$eval(this.COUNTRY_TABLE, (els) => els.map((el) => el.innerHTML.split('"', 2).pop()))

      let arrayOfCountries: ICountryUpdatedFields[] = []
      for(let link of countriesLinks){
        const pageCountry: Page = await this.crawlerServiceUtil.crawl(`${this.SITE_URL}${link}`);

        const name = await pageCountry.$eval(this.COUNTRY_NAME, el => {
          const nameOfCountry = el.innerHTML.slice(0,-23);
          return nameOfCountry;
        })
        
        const {populationRank, capital, subregion, density} = await pageCountry.$$eval(this.COUNTRY_ROWVALUE, (els) => {
          const populationRank = els[0].textContent;
          const density = els[7].textContent;
          const capital = els[10].textContent;
          const subregion = els[12].textContent;
          return {
            populationRank,
            capital,
            subregion,
            density
          }
        });
        
        const {medianAge, medianManAge, medianWomanAge} = await pageCountry.$$eval(this.COUNTRY_AGE, (els) => {
          if (els[0]){  
            const medianAge = els[0].textContent;
            const medianManAge = els[1].textContent;
            const medianWomanAge = els[2].textContent;
            return {
              medianAge,
              medianManAge,
              medianWomanAge
            }
          } else {
            const medianAge = null;
            const medianManAge = null;
            const medianWomanAge = null;
            return {
              medianAge,
              medianManAge,
              medianWomanAge
            }
          }});
        
        const population = await pageCountry.$eval(this.COUNTRY_POPULATION, (el) => el.textContent);
        
        arrayOfCountries.push({
          name,
          population,
          populationRank,
          capital,
          density,
          subregion,
          medianAge,
          medianManAge,
          medianWomanAge
        });
        await this.crawlerServiceUtil.closePage(pageCountry);
      }
      await this.crawlerServiceUtil.closePage(page);
            
      return arrayOfCountries;
    } catch(error) {
      await this.crawlerServiceUtil.closePage(page);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }

  private async scrapeContinents(page: Page) {
    try {
      const mainLinks: ElementHandle[] = await page.$$(this.NAVIGATION_ID);
      const continentLink = Array.from(mainLinks)[this.LOCL_CONTINENT];

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
