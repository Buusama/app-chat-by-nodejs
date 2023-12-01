import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { DynamicModule, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const databaseConfig: DataSourceOptions =
      this.configService.get<DataSourceOptions>('database');
    return {
      autoLoadEntities: true,
      ...databaseConfig,
    };
  }
}

export class DatabaseProvider {
  public static register(): DynamicModule {
    return TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    });
  }
}
