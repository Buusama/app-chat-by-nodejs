import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuditObserverService {
  public userId: number;

  constructor() {}

  set(userId: number): number {
    return (this.userId = userId);
  }
  get(): number {
    return this.userId;
  }
}
