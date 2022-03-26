import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService {
  private prefix?: string;

  log(message: string): void {
    let formattedMessage: string = message;

    if (this.prefix) {
      formattedMessage = `[${this.prefix}] ${message}`;
    }
    console.log(formattedMessage);
  }

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }
}
