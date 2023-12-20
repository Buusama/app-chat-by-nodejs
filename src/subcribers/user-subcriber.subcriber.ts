import {
  EventSubscriber,
  EntitySubscriberInterface,
  DataSource,
  InsertEvent,
  UpdateEvent,
  SoftRemoveEvent,
} from 'typeorm';
import { BaseEntity } from '../entities/base-entity.entity';
import { Injectable } from '@nestjs/common';
import { AuditObserverService } from '../modules/observers/audit-observer.service';
import { UserInterceptor } from '../interceptors/user-interceptor.interceptor';
import { UseInterceptors } from '@nestjs/common';

@EventSubscriber()
@Injectable()
@UseInterceptors(UserInterceptor)
export class UserSubscriber implements EntitySubscriberInterface<BaseEntity> {
  constructor(
    dataSource: DataSource,
    private readonly auditObserverService: AuditObserverService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return BaseEntity;
  }
  beforeInsert(event: InsertEvent<BaseEntity>) {
    event.entity.created_user_id = this.auditObserverService.get();
    event.entity.updated_user_id = this.auditObserverService.get();
  }

  beforeUpdate(event: UpdateEvent<BaseEntity>) {
    event.entity.updated_user_id = this.auditObserverService.get();
  }

  beforeSoftRemove(event: SoftRemoveEvent<BaseEntity>) {
    event.entity.deleted_user_id = this.auditObserverService.get();
  }
}
