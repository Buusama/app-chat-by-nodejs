import { BaseEnum } from '../base-enum';

export enum FriendStatusValue {
  DANG_CHO = 1,
  DA_TU_CHOI = 2,
  DA_DONG_Y = 3,
}

export enum FriendStatusLabel {
  DANG_CHO = 'Đang chờ',
  DA_TU_CHOI = 'Đã từ chối',
  DA_DONG_Y = 'Đã đồng ý',
}

export class FriendStatus extends BaseEnum {
  constructor() {
    super(FriendStatusValue, FriendStatusLabel);
  }
}
