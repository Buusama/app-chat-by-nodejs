import { Module } from '@nestjs/common';
import { AuditObserverService } from './audit-observer.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [AuditObserverService],
  exports: [AuditObserverService],
})
export class AuditObserverModule {}
