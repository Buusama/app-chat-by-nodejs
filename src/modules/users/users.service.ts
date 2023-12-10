import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { PageResponseDto } from '../pagination/dto/page-response.dto';
import { GetListUsersDto } from './dto/get-list-users.dto';
import { PageMetaDto } from '../pagination/dto/page-meta.dto';
import { PageService } from '../pagination/page.service';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class UsersService extends PageService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private s3Service: AwsService,
  ) {
    super();
  }

  async getUsers(
    getListUsersDto: GetListUsersDto,
    userId: number,
  ): Promise<PageResponseDto<User>> {
    const queryBuilder = await this.paginate(
      this.usersRepository,
      getListUsersDto,
    );
    queryBuilder
      .select([
        'table.id as id',
        'name',
        'gender',
        'phone_number',
        'avatar',
        'level',
        'certificate',
        'province',
        'birthday',
        'nationality',
      ])
      .leftJoin('bookmarks', 'bookmarks', `table.id = bookmarks.receiver_id and bookmarks.sender_id = ${userId}`)
      .addSelect('if(bookmarks.receiver_id is not null, 1, 0)', 'bookmarked')
      .where('table.deleted_at is null')
      .andWhere('table.id != :id', { id: userId });
    const template: string[] = [
      getListUsersDto.level
        ? `((1 - ABS(table.level - ${getListUsersDto.level}) / ${getListUsersDto.level})`
        : '(1',
      getListUsersDto.gender
        ? `if(table.gender = ${getListUsersDto.gender}, 1, 0)`
        : '1',
      getListUsersDto.nationality
        ? `if(table.nationality = '${getListUsersDto.nationality}', 1, 0)`
        : '1',
      getListUsersDto.province
        ? `if(table.province = '${getListUsersDto.province}', 1, 0)`
        : '1',
      getListUsersDto.age
        ? `(1 - ABS(DATEDIFF(table.birthday, NOW()) / 365 - ${getListUsersDto.age}) / ${getListUsersDto.age}))/5*100`
        : '1)/5*100',
    ];
    const selectFilter = template.join(' + ');

    if (
      getListUsersDto.age ||
      getListUsersDto.gender ||
      getListUsersDto.level ||
      getListUsersDto.nationality ||
      getListUsersDto.province
    ) {
      queryBuilder.addSelect(selectFilter, 'filter');
      queryBuilder.orderBy('filter', 'DESC');
    }

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getRawMany();
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

  async getUser(user_id: number): Promise<PageResponseDto<User>> {
    return this.usersRepository
      .findOne({
        where: { id: user_id },
        select: [
          'name',
          'gender',
          'phone_number',
          'avatar',
          'level',
          'certificate',
          'province',
          'birthday',
          'nationality',
        ],
      })
      .then((response) => new PageResponseDto(response));
  }
}
