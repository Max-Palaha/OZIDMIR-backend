import { ElementHandle } from 'puppeteer';
import { ICountries } from './countries.interface';

export interface IScrapeCountries {
  countries: ICountries[];
  countryElements: ElementHandle<Element>[];
  continent: string;
}
