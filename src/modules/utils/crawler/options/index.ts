import { Viewport, WaitForOptions, ClickOptions } from 'puppeteer';

export const pageOptions: WaitForOptions = {
  waitUntil: 'networkidle0',
};
export const viewPort: Viewport = {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
  hasTouch: false,
  isLandscape: false,
  isMobile: false,
};

export const clickPage: ClickOptions = {
  delay: 500,
};
