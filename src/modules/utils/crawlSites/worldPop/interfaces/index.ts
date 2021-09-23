import { ElementHandle } from 'puppeteer';

export interface scrapeContinents {
  continents: string[];
  continentElements: ElementHandle<Element>[];
}
