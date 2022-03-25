import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Browser, Page, Viewport, WaitForOptions, ElementHandle } from 'puppeteer';
import * as puppeteer from 'puppeteer';

import { clickPage, pageOptions, viewPort } from './helpers/crawler.options';

@Injectable()
export class CrawlerServiceUtils {
  // errors
  private readonly BROWSER_CONNECTED_ERROR: string = 'Cann not connect to current browser';
  // values
  private readonly USER_AGENT: string = 'INSERT_USERAGENT';
  private readonly TIMEOUT: number = 20000;
  private readonly COUNT_OF_DEFAULT_PAGES: number = 1;
  private readonly DEFAULT_TIMEOUT_FOR_BROWSER: number = 3000;
  private readonly DEFAULT_COUNT_OF_PAGES_PER_BROWSER: number = 5;
  private readonly slowMo: number = 0;
  private countOfOpenedPage: number = 0;
  private readonly devTools: boolean = false;
  private readonly headless: boolean;
  private readonly viewPort: Viewport;
  private readonly pageOptions: WaitForOptions;
  private browser: Browser;
  private isBrowserConnected: boolean;
  // INPUT HANDLER
  private readonly CONFIRM_KEYBOARD_NAME: puppeteer.KeyInput = 'Enter';

  constructor(@Inject('HEADLESS') headless: boolean) {
    this.pageOptions = pageOptions;
    this.viewPort = viewPort;
    this.headless = headless;
    this.isBrowserConnected = false;
  }

  public async crawl(url: string, isDisableImages: boolean = true): Promise<Page> {
    try {
      if (!this.isBrowserConnected) {
        await this.startBrowser();
      } else {
        await this.waitForConnectedBrowser();
      }
      const currentPage: Page = await this.createPage(url);
      if (isDisableImages) {
        await this.disableImages(currentPage);
      }

      return currentPage;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async closePage(page: Page): Promise<void> {
    try {
      this.countOfOpenedPage -= 1;
      await page.close();
      await this.releaseBrowser();

      return;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getProperty(element: ElementHandle<Element>, property: string): Promise<string> {
    try {
      const elementProperty: puppeteer.JSHandle<unknown> = await element.getProperty(property);
      const elementData: string = await elementProperty.jsonValue();

      return elementData;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async clickHandler(page: Page, element: ElementHandle<Element>): Promise<void> {
    try {
      await Promise.all([
        element.click(clickPage), // Clicking the link will indirectly cause a navigation
        page.waitForNavigation(), // The promise resolves after navigation has finished
      ]);
    } catch (err: unknown) {
      await this.closePage(page);

      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async inputHandler(page: Page, inputValue: string, selectorName: string): Promise<void> {
    await page.focus(selectorName);
    await page.keyboard.type(inputValue);
    await Promise.all([page.keyboard.press(this.CONFIRM_KEYBOARD_NAME), page.waitForNavigation()]);
  }

  private async startBrowser(): Promise<void> {
    try {
      this.isBrowserConnected = true;
      this.browser = await puppeteer.launch({
        headless: this.headless,
        slowMo: this.slowMo,
        devtools: this.devTools,
        ignoreHTTPSErrors: true,
      });

      return;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async releaseBrowser(): Promise<void> {
    try {
      const pages: Page[] = await this.browser.pages();
      if (pages.length === this.COUNT_OF_DEFAULT_PAGES) {
        await this.browser.close();
        this.isBrowserConnected = false;
      }

      return;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async createPage(url: string): Promise<Page> {
    await this.waitForAvailablePage();
    this.countOfOpenedPage += 1;
    const page: Page = await this.browser.newPage();
    try {
      await page.setViewport(this.viewPort);
      await page.setUserAgent(this.USER_AGENT);
      await page.setJavaScriptEnabled(true);
      page.setDefaultNavigationTimeout(this.TIMEOUT);
      await page.goto(url, this.pageOptions);

      return page;
    } catch (err: unknown) {
      await this.closePage(page);

      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async disableImages(page: Page): Promise<void> {
    try {
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (request.resourceType() === 'document') {
          request.continue();
        } else {
          request.abort();
        }
      });
    } catch (err: unknown) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async waitForConnectedBrowser(): Promise<Browser> {
    if (!this.browser) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!this.browser) {
            reject(this.BROWSER_CONNECTED_ERROR);
          }
          resolve(this.browser);
        }, this.DEFAULT_TIMEOUT_FOR_BROWSER);
      });
    }

    return this.browser;
  }

  private async waitForAvailablePage(): Promise<void> {
    if (this.countOfOpenedPage >= this.DEFAULT_COUNT_OF_PAGES_PER_BROWSER) {
      new Promise((resolve) => {
        while (this.countOfOpenedPage >= this.DEFAULT_COUNT_OF_PAGES_PER_BROWSER) {
          setTimeout(() => true, this.DEFAULT_TIMEOUT_FOR_BROWSER);
        }
        resolve(true);
      });
    }
  }
}
