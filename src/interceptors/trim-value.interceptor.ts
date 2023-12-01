import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TrimValueInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const body = ctx.getRequest().body;

    if (this.isObj(body)) {
      ctx.getRequest().body = this.trim(body);
    }

    return next.handle();
  }

  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(values) {
    Object.keys(values).forEach((key) => {
      if (key !== 'password') {
        if (this.isObj(values[key])) {
          values[key] = this.trim(values[key]);
        } else {
          if (typeof values[key] === 'string') {
            values[key] = values[key].trim();
          }
        }
      }
    });
    return values;
  }
}
