import { Factory, FactorizedAttrs } from '@jorgebodega/typeorm-factory';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { faker, fakerJA, fakerVI } from '@faker-js/faker';
import { NationalityLabel } from '../../commons/enums/user/nationality-enum';

export class UserFactory extends Factory<User> {
  protected entity = User;
  protected dataSource: DataSource;

  protected attrs(): FactorizedAttrs<User> {
    const nationality = fakerVI.helpers.enumValue(NationalityLabel);
    const gender = faker.number.int({ min: 1, max: 2 });
    const isMale = gender === 1;

    let firstName = '';
    let lastName = '';
    let name = '';

    if (nationality === NationalityLabel.VIETNAM) {
      firstName = fakerVI.person.firstName(isMale ? 'male' : 'female');
      lastName = fakerVI.person.lastName(isMale ? 'male' : 'female');
      name = `${lastName} ${firstName}`;
    } else if (nationality === NationalityLabel.JAPAN) {
      firstName = fakerJA.person.firstName(isMale ? 'male' : 'female');
      lastName = fakerJA.person.lastName(isMale ? 'male' : 'female');
      name = `${firstName} ${lastName}`;
    }

    const minAge = 10;
    const maxAge = 50;
    const maxDateOfBirth = new Date();
    maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - minAge);
    const minDateOfBirth = new Date();
    minDateOfBirth.setFullYear(minDateOfBirth.getFullYear() - maxAge);

    const birthday = faker.date.between({
      from: minDateOfBirth,
      to: maxDateOfBirth,
    });

    return {
      name,
      email: faker.internet.email({
        firstName,
        lastName,
        provider: 'gmail.com',
      }),
      password: 'password',
      birthday,
      gender: gender.toString(),
      avatar: faker.image.avatar(),
      phone: fakerVI.phone.number().replace(/\s/g, ''),
      level: faker.number.int({ min: 0, max: 5 }).toString(),
      province: faker.number.int({ min: 1, max: 63 }).toString(),
      certificate: faker.image.avatar(),
      nationality,
      role: faker.number.int({ min: 0, max: 1 }),
    };
  }
}
