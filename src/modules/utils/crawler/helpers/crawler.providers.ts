export const HEADLESS: string = 'HEADLESS';
interface IProvider {
  provide: string;
  useValue: boolean;
}

export const headlessProvider: IProvider = {
  provide: HEADLESS,
  useValue: false,
};
