import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ElementHandle } from 'puppeteer';
import { Browser, Page, Viewport, WaitForOptions } from 'puppeteer';
import { clickPage, pageOptions, viewPort } from './options';

@Injectable()
export class CrawlerServiceUtils {
  private readonly USER_AGENT = 'INSERT_USERAGENT';
  private readonly TIMEOUT = 20000;
  private readonly COUNT_OF_DEFAULT_PAGES = 1;
  private readonly slowMo = 0;
  private readonly devTools = false;
  private readonly headless: boolean;
  private readonly viewPort: Viewport;
  private readonly pageOptions: WaitForOptions;
  private browser: Browser;

  constructor(@Inject('HEADLESS') headless: boolean) {
    this.pageOptions = pageOptions;
    this.viewPort = viewPort;
    this.headless = headless;
  }

  public async crawl(url: string): Promise<Page> {
    try {
      if (!this.browser) {
        await this.startBrowser();
      }
      const currentPage = await this.createPage(url);
      await this.disableImages(currentPage);

      return currentPage;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async closePage(page: Page): Promise<void> {
    try {
      await page.close();
      await this.releaseBrowser();

      return;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async releaseBrowser(): Promise<void> {
    try {
      const pages = await this.browser.pages();
      if (pages.length === this.COUNT_OF_DEFAULT_PAGES) {
        await this.browser.close();

        this.browser = null;
      }

      return;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getProperty(element: ElementHandle<Element>, property: string): Promise<string> {
    try {
      const elementProperty = await element.getProperty(property);
      const elementData: string = await elementProperty.jsonValue();

      return elementData;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async clickHandler(page: Page, element: ElementHandle<Element>) {
    try {
      await Promise.all([
        element.click(clickPage), // Clicking the link will indirectly cause a navigation
        page.waitForNavigation(), // The promise resolves after navigation has finished
      ]);
    } catch (err) {
      await this.closePage(page);

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async startBrowser(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: this.headless,
        slowMo: this.slowMo,
        devtools: this.devTools,
        ignoreHTTPSErrors: true,
      });

      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async createPage(url: string): Promise<Page> {
    const page = await this.browser.newPage();
    try {
      await page.setViewport(this.viewPort);
      await page.setUserAgent(this.USER_AGENT);
      await page.setJavaScriptEnabled(true);
      page.setDefaultNavigationTimeout(this.TIMEOUT);
      await page.goto(url, this.pageOptions);

      return page;
    } catch (err) {
      await this.closePage(page);

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async disableImages(page: Page) {
    try {
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (request.resourceType() === 'document') {
          request.continue();
        } else {
          request.abort();
        }
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
