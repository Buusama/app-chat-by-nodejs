import { BaseEnum } from '../base-enum';

export enum NationalityValue {
  VIETNAM = 1,
  JAPAN = 2,
  CHINA = 3,
  KOREA = 4,
  USA = 5,
  UK = 6,
  FRANCE = 7,
  GERMANY = 8,
  ITALY = 9,
  SPAIN = 10,
  OTHER = 11,
}

export enum NationalityLabel {
  VIETNAM = 'VN',
  JAPAN = 'JP',
  CHINA = 'CN',
  KOREA = 'KR',
  USA = 'US',
  UK = 'UK',
  FRANCE = 'FR',
  GERMANY = 'DE',
  ITALY = 'IT',
  SPAIN = 'ES',
  OTHER = 'OTHER',
}

export class Nationality extends BaseEnum {
  constructor() {
    super(NationalityLabel, NationalityValue);
  }
}
