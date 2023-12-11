import { DataSource } from 'typeorm'
import { Seeder } from '@jorgebodega/typeorm-seeding'
import { User } from '../../entities/user.entity'
import { UserFactory } from '../factories/user.factory';
import * as bcrypt from 'bcrypt';
import { faker, fakerJA, fakerVI } from '@faker-js/faker';
export default class CreateUsers extends Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userFactory = new UserFactory();
    const CreatedUsers = await userFactory.makeMany(100);
    const users: User[] = CreatedUsers;
    await dataSource.createEntityManager().save<User>(users);

    //seed 2 special users email: user1@gmail, user2@gmail
    const specialUsers = [
      {
        name: 'Lê Đức Sơn',
        gender: '1',
        avatar: faker.image.avatar(),
        email: 'user1@gmail.com',
        phone: '0123456780',
        level: '3',
        certificate: faker.image.avatar(),
        province: '2',
        password: await bcrypt.hash('password', 10),
        birthday: '1999-01-01',
        nationality: 'VN',
      },
      {
        name: 'Võ Tá Hoan',
        gender: '2',
        avatar: faker.image.avatar(),
        email: 'user2@gmail.com',
        phone: '0123456789',
        level: '2',
        certificate: faker.image.avatar(),
        province: '1',
        password: await bcrypt.hash('password', 10),
        birthday: '1999-01-01',
        nationality: 'VN',
      },
    ]

    try {
      await dataSource.createEntityManager().save(User, specialUsers);
    } catch (error) {
      console.error('Error occurred while seeding special users:', error.message);
    }
  }
}