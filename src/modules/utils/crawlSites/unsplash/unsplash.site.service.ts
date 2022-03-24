import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { CrawlerServiceUtils } from '../../crawler/crawler.utils.service';

@Injectable()
export class UnsplashService {
  private readonly IS_DISABLE_IMAGES: boolean = false;
  private readonly SITE_URL: string = 'https://unsplash.com/';

  private readonly SEARCH_CLASS: string = '.gdt34';
  private readonly IMAGE_CLASS: string = '.YVj9w';
  constructor(private crawlerServiceUtil: CrawlerServiceUtils) {}

  public async getImageByCountry(name: string): Promise<Buffer> {
    const page: Page = await this.crawlerServiceUtil.crawl(this.SITE_URL, this.IS_DISABLE_IMAGES);
    await this.crawlerServiceUtil.crawl(this.SITE_URL, this.IS_DISABLE_IMAGES);
    try {
      await this.crawlerServiceUtil.inputHandler(page, name, this.SEARCH_CLASS);
      // await page.waitForSelector(this.IMAGE_CLASS);
      const imageLink: string = await page.$eval(this.IMAGE_CLASS, (el: HTMLImageElement) => el.src);
      const [response] = await Promise.all([
        page.waitForResponse((response) => response.url().includes('photo')),
        page.goto(imageLink),
      ]);
      const buffer: Buffer = await response.buffer();
      await this.crawlerServiceUtil.closePage(page);

      return buffer;
    } catch (error) {
      await this.crawlerServiceUtil.closePage(page);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
