import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../../entities/message.entity';
import { PageResponseDto } from '../pagination/dto/page-response.dto';
import { CreateTextMessageDto, GetRecentMessagesDto } from './dto';
import { PageService } from '../pagination/page.service';
import { PageMetaDto } from '../pagination/dto/page-meta.dto';

@Injectable()
export class ChatsService extends PageService {
  constructor(
    private ws: WebsocketGateway,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {
    super();
  }

  async getRecentMessages(
    userId: number,
    chat_user_id: number,
    getRecentMessages: GetRecentMessagesDto,
  ): Promise<PageResponseDto<Message>> {
    const queryBuilder = await this.paginate(
      this.messageRepository,
      getRecentMessages,
    );
    queryBuilder
      .select([
        'table.id as id',
        'sender_id',
        'receiver_id',
        'content',
        'created_at',
      ])
      .where(
        '(table.sender_id = :userId AND table.receiver_id = :chat_user_id) OR (table.sender_id = :chat_user_id AND table.receiver_id = :userId)',
        { userId, chat_user_id },
      )
      .orderBy('table.created_at', 'DESC');
    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getRawMany();
    const pageMeta = new PageMetaDto(GetRecentMessagesDto, itemCount);
    return new PageResponseDto(entities, pageMeta);
  }

  async createMessage(
    userId: number,
    chat_user_id: number,
    createTextMessageDto: CreateTextMessageDto,
  ) {
    const newMessage = this.messageRepository.create({
      sender_id: userId,
      receiver_id: chat_user_id,
      content: createTextMessageDto.content,
    });
    await this.messageRepository.save(newMessage);
    return newMessage;
  }

  async createTextMessage(
    userId: number,
    chat_user_id: number,
    createTextMessageDto: CreateTextMessageDto,
  ): Promise<Message> {
    const newMessage = await this.createMessage(
      userId,
      chat_user_id,
      createTextMessageDto,
    );
    return newMessage;
  }
}
