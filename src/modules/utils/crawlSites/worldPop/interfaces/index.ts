import { ElementHandle } from 'puppeteer';

export interface IScrapeContinents {
  continents: string[];
  continentElements: ElementHandle<Element>[];
}

export interface IScrapeCountries {
  countries: TCountries[];
  countryElements: ElementHandle<Element>[];
  continent: string;
}

export type TCountries = {
  name: string;
  population: string;
  density: string;
};
