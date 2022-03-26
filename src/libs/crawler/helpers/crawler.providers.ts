import { Provider } from '@nestjs/common';

export const HEADLESS: string = 'HEADLESS';

export const headlessProvider: Provider = {
  provide: HEADLESS,
  useValue: false,
};
