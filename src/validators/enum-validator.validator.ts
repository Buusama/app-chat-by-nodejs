import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'enumValidator', async: true })
@Injectable()
export class EnumValidator implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const enums = args.constraints[0];
    const exist = Object.values(enums).indexOf(Number(value)) > -1;
    return exist;
  }
  defaultMessage(args: any) {
    return `${args.property} must be one of Enum Value`;
  }
}

export function IsEnumValidator(enums: any, options?: ValidationOptions) {
  return (o: object, propertyName: string) => {
    registerDecorator({
      name: 'isEnum',
      target: o.constructor,
      propertyName,
      options,
      constraints: [enums],
      validator: EnumValidator,
      async: true,
    });
  };
}
