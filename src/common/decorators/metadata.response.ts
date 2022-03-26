import { DecoratorType } from '../constants/decorator.type.constants';
import { MetadataStorageDto } from '../dto/metadata.storage.dto';

export function MetadataResponse(metadataKeys: symbol[]) {
  return function (target: Record<string, unknown>, methodName: string | symbol, index: number): void {
    metadataKeys.forEach((metadataKey) => {
      const params: MetadataStorageDto[] =
        Reflect.getOwnMetadata(metadataKey, target, methodName) || ([] as MetadataStorageDto[]);
      params.push({
        index,
        type: DecoratorType.RESPONSE,
      });
      Reflect.defineMetadata(metadataKey, params, target, methodName);
    });
  };
}
