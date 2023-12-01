import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from '../config';

export class ConfigProvider {
  public static register(): DynamicModule {
    return ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig],
    });
  }
}
