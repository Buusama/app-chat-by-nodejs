import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'notFullEmptyLine', async: true })
export class NotFullEmptyLineValidator implements ValidatorConstraintInterface {
  async validate(value: string): Promise<boolean> {
    if (!value || typeof value !== 'string') return true;

    const lines: Array<string> = value.split(new RegExp('\\n|\\r|\\r\\n', 'g'));
    const blankLines = lines.filter((value) => {
      return value.trim() === '';
    });

    if (lines.length === blankLines.length) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must not full of blank line`;
  }
}

export function IsNotFullEmptyLine(options?: ValidationOptions) {
  return (o: object, propertyName: string) => {
    registerDecorator({
      target: o.constructor,
      propertyName,
      options,
      validator: NotFullEmptyLineValidator,
      async: true,
    });
  };
}
