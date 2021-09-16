import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser, Page, Viewport, WaitForOptions } from 'puppeteer';

@Injectable()
export class CrawlerServiceUtils {
  private readonly USER_AGENT = 'INSERT_USERAGENT';
  private readonly TIMEOUT = 20000;
  private COUNT_OF_DEFAULT_PAGES = 1;
  private headless = false;
  private slowMo = 0;
  private devTools = false;
  private browser: Browser;
  private pageOptions: WaitForOptions = {
    waitUntil: 'networkidle0',
  };
  private readonly viewPort: Viewport = {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  };

  async crawl(url: string) {
    if (!this.browser) {
      await this.startBrowser();
    }
    const currentPage = await this.createPage(url);
    const context = await currentPage.content();
    await currentPage.close();
    await this.releaseBrowser();
    return context;
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

  private async startBrowser(
    headless: boolean = this.headless,
    slowMo: number = this.slowMo,
    devTools: boolean = this.devTools,
  ): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless,
        slowMo,
        devtools: devTools,
        ignoreHTTPSErrors: true,
      });

      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async createPage(
    url: string,
    options: WaitForOptions = this.pageOptions,
  ): Promise<Page> {
    const page = await this.browser.newPage();
    try {
      await page.setViewport(this.viewPort);
      await page.setUserAgent(this.USER_AGENT);
      await page.setJavaScriptEnabled(true);
      page.setDefaultNavigationTimeout(this.TIMEOUT);
      await page.goto(url, options);

      return page;
    } catch (err) {
      await page.close();

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
