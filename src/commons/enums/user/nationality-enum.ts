import { BaseEnum } from '../base-enum';

export enum NationalityValue {
  VIETNAM = 1,
  JAPAN = 2,
}

export enum NationalityLabel {
  VIETNAM = 'VN',
  JAPAN = 'JP',
}

export class Nationality extends BaseEnum {
  constructor() {
    super(NationalityLabel, NationalityValue);
  }
}
