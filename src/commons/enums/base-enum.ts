export class BaseEnum {
  private objectLabel: object;
  private objectValue: object;

  constructor(objectLabel: object, objectValue: object) {
    this.objectLabel = objectLabel;
    this.objectValue = objectValue;
  }

  public toString(dir: string): string {
    return this.objectLabel[this.objectValue[dir]]
      ? this.objectLabel[this.objectValue[dir]]
      : null;
  }

  public stringToLabels(value: string, seperator: string): string {
    const array = value.split(',');
    const map = array
      .map((value) => this.toString(value))
      .filter((value) => value !== undefined && value !== null);
    return map.join(seperator);
  }
}
