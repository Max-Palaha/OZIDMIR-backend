import { DecoratorType } from '../constants/decorator.type.constants';

export class MetadataStorageDto {
  index: number;
  type: DecoratorType;
  key?: string;
}
