import { Injectable } from '@nestjs/common';
import { InjectPage } from 'nest-puppeteer';
import type { Page } from 'puppeteer';

@Injectable()
export class CrawlerService {
  constructor(@InjectPage() private readonly page: Page) {}

  async crawl(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle2' });
    const content = await this.page.content();

    return { content };
  }
}