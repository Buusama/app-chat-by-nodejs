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
  VIETNAM = 'Việt Nam',
  JAPAN = 'Nhật Bản',
  CHINA = 'Trung Quốc',
  KOREA = 'Hàn Quốc',
  USA = 'Mỹ',
  UK = 'Anh',
  FRANCE = 'Pháp',
  GERMANY = 'Đức',
  ITALY = 'Ý',
  SPAIN = 'Tây Ban Nha',
  OTHER = 'Khác',
}

export class Nationality extends BaseEnum {
  constructor() {
    super(NationalityLabel, NationalityValue);
  }
}
