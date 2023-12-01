import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ name: 'uniqueColumn', async: true })
@Injectable()
export class UniqueColumnValidator implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [model] = args.constraints;
    const property = args.property;
    const exist = await this.dataSource
      .getRepository(model)
      .find({ where: { [property]: value } });
    return exist.length === 0;
  }
  defaultMessage(args: any) {
    return `${args.property} already exist.`;
  }
}

export function IsUnique(entity: any, options?: ValidationOptions) {
  return (o: object, propertyName: string) => {
    registerDecorator({
      name: 'isUnique',
      target: o.constructor,
      propertyName,
      options,
      constraints: [entity],
      validator: UniqueColumnValidator,
      async: true,
    });
  };
}
