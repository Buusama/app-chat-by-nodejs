import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { textareaToLines } from '../supports/helpers';

@ValidatorConstraint({ name: 'uniqueLine', async: true })
export class UniqueLineValidator implements ValidatorConstraintInterface {
  async validate(value: string): Promise<boolean> {
    if (!value || typeof value !== 'string') return true;

    const uniqueArray: Array<string> = [];
    const lines: Array<string> = textareaToLines(value);

    if (lines.length === 0) return true;

    for (value of lines) {
      if (uniqueArray.includes(value)) return false;

      uniqueArray.push(value);
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must not have duplicated value`;
  }
}

export function IsUniqueLine(options?: ValidationOptions) {
  return (o: object, propertyName: string) => {
    registerDecorator({
      target: o.constructor,
      propertyName,
      options,
      validator: UniqueLineValidator,
      async: true,
    });
  };
}
