import { DecoratorType } from '@common/constants/decorator.type.constants';
import { MetadataStorageDto } from '@common/dto/metadata.storage.dto';
import { Response } from 'express';
export class CookieDataMap {
  private readonly MONTH_IN_SECONDS: number = 30 * 24 * 60 * 60 * 1000;

  public setValue(fieldName: string, response: Response, value: string): void {
    response.cookie(fieldName, value, {
      maxAge: this.MONTH_IN_SECONDS,
      httpOnly: true,
    });
  }

  public clearValue(fieldName: string, response: Response): void {
    response.clearCookie(fieldName);
  }

  public prepareData(args: unknown[], metadataParams: MetadataStorageDto[]): Response {
    let res: Response;
    metadataParams.forEach((param) => {
      switch (param.type) {
        case DecoratorType.RESPONSE: {
          res = args[param.index] as Response;
          break;
        }
      }
    });

    return res;
  }
}
