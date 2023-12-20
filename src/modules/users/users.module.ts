import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { AwsModule } from '../aws/aws.module';
import { UniqueColumnValidator } from '../../validators/unique-column.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AwsModule],
  controllers: [UsersController],
  providers: [UsersService, UniqueColumnValidator],
  exports: [UsersService],
})
export class UsersModule {}
