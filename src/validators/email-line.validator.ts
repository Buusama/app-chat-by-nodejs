import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isEmail,
  registerDecorator,
} from 'class-validator';
import { textareaToLines } from '../supports/helpers';

@ValidatorConstraint({ name: 'emailLine', async: true })
export class EmailLineValidator implements ValidatorConstraintInterface {
  protected failEmails: Array<string>;

  constructor() {
    this.failEmails = [];
  }

  async validate(value: string): Promise<boolean> {
    this.failEmails = [];

    if (!value || typeof value !== 'string') return true;

    const lines: Array<string> = textareaToLines(value);

    if (lines.length === 0) return true;

    lines.forEach((value) => {
      if (!isEmail(value)) {
        this.failEmails.push(value);
      }
    });

    if (this.failEmails.length > 0) return false;

    return true;
  }

  defaultMessage() {
    return this.failEmails.join(', ') + ' must be email';
  }
}

export function IsEmailLine(options?: ValidationOptions) {
  return (o: object, propertyName: string) => {
    registerDecorator({
      target: o.constructor,
      propertyName,
      options,
      validator: new EmailLineValidator(),
      async: true,
    });
  };
}
