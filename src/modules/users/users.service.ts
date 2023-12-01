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
  ): Promise<PageResponseDto<User>> {
    const queryBuilder = await this.paginate(
      this.usersRepository,
      getListUsersDto,
    );
    queryBuilder.where('table.deleted_at is null');
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
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
