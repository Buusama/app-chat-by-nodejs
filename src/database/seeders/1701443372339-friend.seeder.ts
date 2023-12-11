import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Friend } from '../../entities/friend.entity';
import { FriendStatusValue } from '../../commons/enums/friend/status-enum';

export default class FriendSeeder extends Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const users = await dataSource.getRepository(User).find();
    const friendData = [];

    for (let i = 0; i < users.length; i++) {
      const sender = users[i];

      for (let j = 0; j < users.length; j++) {
        const receiver = users[j];

        if (sender.id !== receiver.id && Math.random() < 0.4) {
          let status;

          const randomValue = Math.random();

          if (randomValue < 0.1) {
            status = FriendStatusValue.DANG_CHO;
          } else if (randomValue < 0.2) {
            status = FriendStatusValue.DA_TU_CHOI;
          } else {
            status = FriendStatusValue.DA_DONG_Y;
          }
          friendData.push({
            sender_id: sender.id,
            receiver_id: receiver.id,
            status,
          });
        }
      }
    }

    try {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(Friend)
        .values(friendData)
        .execute();
    } catch (error) {
      console.error('Error occurred while seeding friends:', error.message);
    }
  }
}