import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendStatusValue } from '../../commons/enums/friend/status-enum';
import { Friend } from '../../entities/friend.entity';
import { Message } from '../../entities/message.entity';
import { User } from '../../entities/user.entity';
import { AwsService } from '../aws/aws.service';
import { PageMetaDto } from '../pagination/dto/page-meta.dto';
import { PageResponseDto } from '../pagination/dto/page-response.dto';
import { PageService } from '../pagination/page.service';
import { GetListFriendsDto } from './dto/get-list-friends.dto';
import { GetListUsersDto } from './dto/get-list-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends PageService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private s3Service: AwsService,
  ) {
    super();
  }

  async getUsers(
    getListUsersDto: GetListUsersDto,
    userId: number,
  ): Promise<PageResponseDto<User>> {
    const queryBuilder = await this.usersRepository.createQueryBuilder('table');
    queryBuilder
      .select([
        'table.id as id',
        'name',
        'gender',
        'phone',
        'avatar',
        'level',
        'certificate',
        'province',
        'birthday',
        'nationality',
      ])
      .leftJoin(
        'table.bookmarks',
        'bookmarks',
        `bookmarks.sender_id = ${userId}`,
      )
      .addSelect('if(bookmarks.receiver_id is not null, 1, 0)', 'bookmarked')
      .addSelect(
        '(SELECT COUNT(bookmarks.id) FROM bookmarks WHERE bookmarks.receiver_id = table.id) AS bookmark_count',
      )
      .where('table.deleted_at is null')
      .andWhere('table.id != :id', { id: userId });
    if (getListUsersDto.search) {
      queryBuilder.andWhere('(table.name LIKE :search)', {
        search: `%${getListUsersDto.search}%`,
      });
    }

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getRawMany();
    if (getListUsersDto.age ||
      getListUsersDto.gender ||
      getListUsersDto.level ||
      getListUsersDto.nationality ||
      getListUsersDto.province) {

      entities.forEach(element => {
        let filter = 0;
        let weight = 0;

        const { age, gender, level, nationality, province } = getListUsersDto;

        if (level) {
          const deviation = Math.abs(element.level - Number(level));
          filter += deviation > Number(level) ? 0 : (1 - deviation / Number(level)) * 2;
          weight += 2;
        }
        if (age) {
          const today = new Date();
          const deviation = Math.abs(Math.round((today.getTime() - new Date(element.birthday).getTime()) / (1000 * 3600 * 24 * 365)) - Number(age));
          filter += deviation > Number(age) ? 0 : (1 - deviation / Number(age)) * 2;
          weight += 2;
        }
        if (gender) {
          filter += element.gender == gender ? 2 : 0;
          weight += 2;
        }
        if (province) {
          filter += element.province == province ? 1 : 0;
          weight += 1;
        }
        if (nationality) {
          filter += element.nationality == nationality ? 1 : 0;
          weight += 1;
        }
        element.filter = weight > 0 ? (filter / weight) * 100 : 0;
      });

      entities.sort((a, b) => b.filter - a.filter);
    }
    //pagination
    if (getListUsersDto.sort_by && getListUsersDto.sort_enum) {
      entities.sort((a, b) => {
        if (getListUsersDto.sort_by === 'filter') {
          return getListUsersDto.sort_enum === 'ASC' ? a.filter - b.filter : b.filter - a.filter;
        }
        return getListUsersDto.sort_enum === 'ASC' ? a[getListUsersDto.sort_by] - b[getListUsersDto.sort_by] : b[getListUsersDto.sort_by] - a[getListUsersDto.sort_by];
      });
    }
    if (getListUsersDto.skip != null && getListUsersDto.take != null) {
      entities.splice(0, getListUsersDto.skip);
      entities.splice(getListUsersDto.take, entities.length - getListUsersDto.take);
    }
    const pageMeta = new PageMetaDto(getListUsersDto, itemCount);
    return new PageResponseDto(entities, pageMeta);
  }

  async uploadAvatar(userId: number, file: Express.Multer.File): Promise<any> {
    try {
      const uploadResult = await this.s3Service.uploadFile(
        file.originalname,
        file.buffer,
        file.mimetype,
        `userAvatar/${userId}/images`,
      );
      return uploadResult;
    } catch (error) {
      throw error;
    }
  }

  async uploadCertificate(
    userId: number,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      const uploadResult = await this.s3Service.uploadFile(
        file.originalname,
        file.buffer,
        file.mimetype,
        `userCertificate/${userId}/images`,
      );
      return uploadResult;
    } catch (error) {
      throw error;
    }
  }
  getUserById(id: number): Promise<PageResponseDto<User>> {
    return this.usersRepository.findOneBy({ id }).then((users) => {
      return new PageResponseDto(users);
    });
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async getUser(
    user_id: number,
    current_user_id: number,
  ): Promise<PageResponseDto<User>> {
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id as id',
        'name',
        'gender',
        'email',
        'phone',
        'avatar',
        'level',
        'certificate',
        'province',
        'birthday',
        'nationality',
        'IF(bookmarks.receiver_id IS NOT NULL, 1, 0) as bookmarked',
      ])
      .leftJoin(
        'user.bookmarks',
        'bookmarks',
        `bookmarks.sender_id = ${current_user_id}`,
      )
      .addSelect(
        `(SELECT friends.status 
          FROM friends 
          WHERE (friends.receiver_id = ${user_id} AND friends.sender_id = ${current_user_id})
            OR (friends.receiver_id = ${current_user_id} AND friends.sender_id = ${user_id})
          LIMIT 1
        ) AS friend_status`,
      )
      .where('user.id = :userId', { userId: user_id })
      .getRawOne();

    if (!result) {
      return null;
    }

    return new PageResponseDto(result);
  }

  async getFriends(
    user_id: number,
    getListFriendsDto: GetListFriendsDto,
  ) {
    const queryBuilder = this.usersRepository.createQueryBuilder('table');
    if (getListFriendsDto.search) {
      queryBuilder.andWhere('(table.name LIKE :search)', {
        search: `%${getListFriendsDto.search}%`,
      });
    }

    const friends = await this.friendRepository.find({
      where: [
        { sender_id: user_id, status: FriendStatusValue.DA_DONG_Y },
        { receiver_id: user_id, status: FriendStatusValue.DA_DONG_Y },
      ],
    });

    const friendIds = friends.map((friend) => {
      if (friend.sender_id === user_id) {
        return friend.receiver_id;
      }
      return friend.sender_id;
    });

    queryBuilder
      .select(['table.id as id', 'name', 'avatar'])
      // .addSelect(
      //   `(SELECT content FROM messages 
      // WHERE (messages.sender_id = ${user_id} AND messages.receiver_id = table.id)
      //  OR (messages.sender_id = table.id AND messages.receiver_id = ${user_id}) 
      //  ORDER BY messages.created_at DESC LIMIT 1) AS last_message`,
      // )
      // .addSelect(
      //   `(SELECT created_at FROM messages 
      // WHERE (messages.sender_id = ${user_id} AND messages.receiver_id = table.id)
      //  OR (messages.sender_id = table.id AND messages.receiver_id = ${user_id}) 
      //  ORDER BY messages.created_at DESC LIMIT 1) AS last_message_created_at`,
      // )
      .addSelect(
        `(SELECT updated_at FROM friends
        WHERE (friends.sender_id = ${user_id} AND friends.receiver_id = table.id)
        OR (friends.sender_id = table.id AND friends.receiver_id = ${user_id})
        AND friends.status = ${FriendStatusValue.DA_DONG_Y}
        LIMIT 1) AS friend_updated_at`,
      )
      .andWhere('table.id IN (:...friendIds)', { friendIds })
      .addOrderBy('friend_updated_at', 'DESC');

    const entities = await queryBuilder.getRawMany()

    for (const element of entities) {
      const last_message = await this.messageRepository.findOne({
        where: [
          { sender_id: user_id, receiver_id: element.id },
          { sender_id: element.id, receiver_id: user_id },
        ],
        order: {
          created_at: 'DESC',
        },
      });
      element.last_message = last_message;
    }

    return new PageResponseDto(entities);
  }

  async updateMember(
    userId: number,
    updateUserDto: UpdateUserDto,
    files?: { avatar?: Express.Multer.File; certificate?: Express.Multer.File },
  ) {
    const avatar = files?.avatar ? files.avatar[0] : null;
    const certificate = files?.certificate ? files.certificate[0] : null;

    const existingUser = await this.usersRepository.findOneByOrFail({
      id: userId,
    });
    const { ...params } = updateUserDto;

    if (params.avatar) {
      delete params.avatar;
    }
    if (params.certificate) {
      delete params.certificate;
    }
    Object.keys(params).forEach((key) => {
      if (params[key] != null && params[key] != undefined && params[key] != '') {
        existingUser[key] = params[key];
      }
    });
    const imageAvatar = avatar ? await this.uploadAvatar(userId, avatar) : null;
    if (imageAvatar) {
      if (existingUser.avatar) {
        const avatar = existingUser.avatar.split('/');
        const key = avatar[avatar.length - 1];
        const fullKey = `userAvatar/${userId}/imageAvatars/${key}`;
        await this.s3Service.deleteFile(fullKey);
      }
      existingUser.avatar = imageAvatar.Location;
    } else {
      if (updateUserDto.avatar === 'null') {
        const avatar = existingUser.avatar.split('/');
        const key = avatar[avatar.length - 1];
        const fullKey = `userAvatar/${userId}/imageAvatars/${key}`;
        await this.s3Service.deleteFile(fullKey);
        existingUser.avatar = '';
      }
    }

    const imageCertificate = certificate
      ? await this.uploadCertificate(userId, certificate)
      : null;
    if (imageCertificate) {
      if (existingUser.certificate) {
        const certificate = existingUser.certificate.split('/');
        const key = certificate[certificate.length - 1];
        const fullKey = `userCertificate/${userId}/imageCertificates/${key}`;
        await this.s3Service.deleteFile(fullKey);
      }
      existingUser.certificate = imageCertificate.Location;
    } else {
      if (updateUserDto.certificate === 'null') {
        const certificate = existingUser.certificate.split('/');
        const key = certificate[certificate.length - 1];
        const fullKey = `userCertificate/${userId}/imageCertificates/${key}`;
        await this.s3Service.deleteFile(fullKey);
        existingUser.certificate = '';
      }
    }

    await this.usersRepository.save(existingUser);

    return this.getUserById(existingUser.id);
  }

  async getProfile(user_id: number): Promise<PageResponseDto<User>> {
    return this.usersRepository.findOneBy({ id: user_id }).then((users) => {
      return new PageResponseDto(users);
    });
  }
}
