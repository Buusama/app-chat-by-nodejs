import { Factory, FactorizedAttrs } from '@jorgebodega/typeorm-factory'
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { faker, fakerJA, fakerVI } from '@faker-js/faker';
import { NationalityLabel } from '../../commons/enums/user/nationality-enum';
import * as bcrypt from 'bcrypt';

export class UserFactory extends Factory<User>{

    protected entity = User;
    protected dataSource: DataSource;
    protected attrs(): FactorizedAttrs<User> {
        const gender = faker.number.int({ min: 1, max: 2 });
        let firstName: string = '';
        let lastName: string = '';
        let name: string = '';
        const nationality = fakerVI.helpers.enumValue(NationalityLabel);
        if (nationality === NationalityLabel.VIETNAM) {
            if (gender === 1) {
                firstName = fakerVI.person.firstName('male');
                lastName = fakerVI.person.lastName('male');
            }
            else {
                firstName = fakerVI.person.firstName('female');
                lastName = fakerVI.person.lastName('female');
            }
            name = `${lastName} ${firstName}`;
        }
        else if (nationality === NationalityLabel.JAPAN) {
            if (gender === 1) {
                firstName = fakerJA.person.firstName('male');
                lastName = fakerJA.person.lastName('male');
            }
            else {
                firstName = fakerJA.person.firstName('female');
                lastName = fakerJA.person.lastName('female');
            }
            name = `${firstName} ${lastName}`;
        }

        

        // Generate a random date of birth within the range of 16 to 50 years old
        const minAge = 10;
        const maxAge = 50;
        const maxDateOfBirth = new Date();
        maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - minAge);
        const minDateOfBirth = new Date();
        minDateOfBirth.setFullYear(minDateOfBirth.getFullYear() - maxAge);

        const birthday = faker.date.between({ from: minDateOfBirth, to: maxDateOfBirth });
        return {
            name: name,
            email: faker.internet.email({ firstName: firstName, lastName: lastName, provider: 'gmail.com' }),
            password: 'password',
            birthday: birthday,
            gender: gender.toString(),
            avatar: faker.image.avatar(),
            phone: fakerVI.phone.number().replace(/\s/g, ''),
            level: faker.number.int({ min: 0, max: 5 }).toString(),
            province: faker.number.int({ min: 1, max: 63 }).toString(),
            certificate: faker.image.avatar(),
            nationality
        };
    }
};