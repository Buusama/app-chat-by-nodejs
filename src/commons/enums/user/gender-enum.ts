import { BaseEnum } from '../base-enum';

export enum GenderValue {
  NAM = 1,
  NU = 2,
  KHAC = 3,
}

export enum GenderLabel {
  NAM = 'Nam',
  NU = 'Nữ',
  KHAC = 'Khác',
}

export class Gender extends BaseEnum {
  constructor() {
    super(GenderLabel, GenderValue);
  }
}
