import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { CreateTextMessageDto, GetRecentMessagesDto } from './dto';
import { EntityNotFoundErrorFilter } from '../../exception_filters/entity-not-found-error.filter';
import { PageResponseDto } from '../pagination/dto/page-response.dto';
import { Message } from '../../entities/message.entity';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('chats')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get(':id/chats')
  @UseFilters(EntityNotFoundErrorFilter)
  async getRecentMessages(
    @Req() req,
    @Param('id') chat_user_id: number,
    @Query() getRecentMessagesDto: GetRecentMessagesDto,
  ): Promise<PageResponseDto<Message>> {
    return this.chatsService.getRecentMessages(
      req.user.id,
      chat_user_id,
      getRecentMessagesDto,
    );
  }

  @Post(':id/chats')
  @UseFilters(EntityNotFoundErrorFilter)
  async createTextMessage(
    @Req() req,
    @Param('id') chat_user_id: number,
    @Body() createTextMessageDto: CreateTextMessageDto,
  ): Promise<{ data: Message }> {
    const message = await this.chatsService.createTextMessage(
      req.user.id,
      chat_user_id,
      createTextMessageDto,
    );
    return {
      data: message,
    };
  }
}
