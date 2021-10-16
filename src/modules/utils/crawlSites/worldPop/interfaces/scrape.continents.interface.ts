import { ElementHandle } from 'puppeteer';

export interface IScrapeContinents {
  continents: string[];
  continentElements: ElementHandle<Element>[];
}
