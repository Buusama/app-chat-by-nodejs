import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityNotFoundErrorFilter } from '../../exception_filters/entity-not-found-error.filter';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { ReplyFriendsDto } from './dto';
import { FriendsService } from './friends.service';

@ApiTags('friends')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('users/:id/friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  @Post()
  @UseFilters(EntityNotFoundErrorFilter)
  async addFriend(@Req() req, @Param('id') receiver_id: number) {
    return this.friendsService.addFriend(req.user.id, receiver_id);
  }

  @Patch()
  @UseFilters(EntityNotFoundErrorFilter)
  async replyFriend(
    @Req() req,
    @Param('id') sender_id: number,
    @Body() replyFriendsDto: ReplyFriendsDto,
  ) {
    return this.friendsService.replyFriend(
      req.user.id,
      sender_id,
      replyFriendsDto,
    );
  }

  @Delete()
  @UseFilters(EntityNotFoundErrorFilter)
  async deleteFriend(@Req() req, @Param('id') receiver_id: number) {
    return this.friendsService.deleteFriend(req.user.id, receiver_id);
  }
}
