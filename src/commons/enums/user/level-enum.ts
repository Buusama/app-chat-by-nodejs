import { BaseEnum } from '../base-enum';

export enum LevelValue {
  N1 = 1,
  N2 = 2,
  N3 = 3,
  N4 = 4,
  N5 = 5,
}

export enum LevelLabel {
  N1 = 'N1',
  N2 = 'N2',
  N3 = 'N3',
  N4 = 'N4',
  N5 = 'N5',
}

export class Level extends BaseEnum {
  constructor() {
    super(LevelLabel, LevelValue);
  }
}
