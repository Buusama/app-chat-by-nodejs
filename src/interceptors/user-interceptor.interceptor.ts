import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditObserverService } from '../modules/observers/audit-observer.service';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly auditObserverService: AuditObserverService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    this.auditObserverService.set(userId);

    return next.handle();
  }
}
