import { Inject } from '@nestjs/common';

export const prefixesForLoggers: string[] = new Array<string>();

export function Logger(
  prefix: string = '',
): (target: Record<string, unknown>, key: string | symbol, index?: number) => void {
  if (!prefixesForLoggers.includes(prefix)) {
    prefixesForLoggers.push(prefix);
  }
  return Inject(`LoggerService${prefix}`);
}
