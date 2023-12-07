import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class UserSeeder extends Seeder {
  async run(dataSource: DataSource): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          name: 'user1',
          gender: '1',
          avatar: 'https://i.pravatar.cc/300',
          email: 'user1@gmail.com',
          phone_number: '0123456789',
          level: '1',
          certificate: 'https://i.pravatar.cc/300',
          province: '2',
          password: await bcrypt.hash('password', 10),
          birthday: '1999-01-01',
          nationality: 'VN',
        },
        {
          name: 'user2',
          gender: '2',
          avatar: 'https://i.pravatar.cc/300',
          email: 'user2@gmail.com',
          phone_number: '0123456789',
          level: '5',
          certificate: 'https://i.pravatar.cc/300',
          province: '1',
          password: await bcrypt.hash('password', 10),
          birthday: '1999-01-01',
          nationality: 'VN',
        },
      ])
      .execute();
  }
}
