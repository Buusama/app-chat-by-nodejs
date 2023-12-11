import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { Bookmark } from '../../entities/bookmark.entity';
import { User } from '../../entities/user.entity';
import { Friend } from '../../entities/friend.entity';
import { FriendStatusValue } from '../../commons/enums/friend/status-enum';

export default class BookmarkSeeder extends Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const users = await dataSource.getRepository(User).find();
    const friends = await dataSource.getRepository(Friend).find();

    const bookmarkData = [];
    for (let i = 0; i < users.length; i++) {
      const sender = users[i];
      for (let j = 0; j < users.length; j++) {
        const receiver = users[j];

        const areFriends = friends.some(
          (friend) =>
            (friend.sender_id === sender.id &&
              friend.receiver_id === receiver.id &&
              friend.status === FriendStatusValue.DA_DONG_Y) ||
            (friend.sender_id === receiver.id &&
              friend.receiver_id === sender.id &&
              friend.status === FriendStatusValue.DA_DONG_Y),
        );

        if (sender.id !== receiver.id && areFriends && Math.random() < 0.4) {
          bookmarkData.push({
            sender_id: sender.id,
            receiver_id: receiver.id,
          });
        }
      }
    }

    try {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(Bookmark)
        .values(bookmarkData)
        .execute();
    } catch (error) {
      console.error('Error occurred while seeding bookmarks:', error.message);
    }
  }
}
