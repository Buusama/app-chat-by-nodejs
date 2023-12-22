import { BaseEnum } from './base-enum';
export enum GlobalEnumValue {
  PAGE_DEFAULT = 1,
  PAGE_SIZE_DEFAULT = 10,
  PAGE_SIZE_MAX = 100,
}
export enum GlobalEnumLabel {
  PAGE_DEFAULT = '1',
  PAGE_SIZE_DEFAULT = '10',
  PAGE_SIZE_MAX = '100',
}
export class GlobalEnum extends BaseEnum {
  constructor() {
    super(GlobalEnumLabel, GlobalEnumValue);
  }
}
