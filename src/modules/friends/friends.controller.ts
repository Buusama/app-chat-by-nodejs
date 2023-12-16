import {
    Body,
    Controller,
    Get,
    Param, Patch, Post,
    Req, UseFilters, UseGuards, UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityNotFoundErrorFilter } from 'src/exception_filters/entity-not-found-error.filter';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { ReplyFriendsDto } from './dto';
import { FriendsService } from './friends.service';

@ApiTags('friends')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('users/:id/friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) { }
    @Post()
    @UseFilters(EntityNotFoundErrorFilter)
    async addFriend(
        @Req() req,
        @Param('id') receiver_id: number,
    ) {
        return this.friendsService.addFriend(req.user.id, receiver_id);
    }

    @Patch()
    @UseFilters(EntityNotFoundErrorFilter)
    async replyFriend(
        @Req() req,
        @Param('id') sender_id: number,
        @Body() replyFriendsDto: ReplyFriendsDto,
    ) {
        return this.friendsService.replyFriend(req.user.id, sender_id, replyFriendsDto);
    }

    @Get()
    @UseFilters(EntityNotFoundErrorFilter)
    async getFriendsRequest(
        @Req() req,
    ) {
        return this.friendsService.getFriendsRequest(req.user.id);
    }

}
