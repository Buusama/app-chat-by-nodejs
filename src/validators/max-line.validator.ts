import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { textareaToLines } from '../supports/helpers';

@ValidatorConstraint({ name: 'maxLine', async: true })
export class MaxLineValidator implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    if (!value || typeof value !== 'string') return true;

    const lines: Array<string> = textareaToLines(value);

    if (lines.length > args.constraints[0]) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'line number exceed ' + args.constraints[0];
  }
}

export function MaxLine(max: number, options?: ValidationOptions) {
  return (o: object, propertyName: string) => {
    registerDecorator({
      target: o.constructor,
      propertyName,
      options,
      constraints: [max],
      validator: MaxLineValidator,
      async: true,
    });
  };
}
