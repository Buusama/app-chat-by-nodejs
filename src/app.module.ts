import { Module } from '@nestjs/common';
import applicationProvider from './providers';
import applicationModular from './modules';
import { UserSubscriber } from './subcribers/user-subcriber.subcriber';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './interceptors/user-interceptor.interceptor';
import { TrimValueInterceptor } from './interceptors/trim-value.interceptor';

@Module({
  imports: [
    ...applicationModular.register(),
    ...applicationProvider.register(),
  ],
  controllers: [],
  providers: [
    UserSubscriber,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TrimValueInterceptor,
    },
  ],
})
export class AppModule {}
