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
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseFilters(EntityNotFoundErrorFilter)
  async getFriendsRequest(@Req() req) {
    return this.notificationsService.getNotifications(req.user.id);
  }
}
