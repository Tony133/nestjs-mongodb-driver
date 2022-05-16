import { DynamicModule, Module } from '@nestjs/common';
import { MongoDbDriverCoreModule } from './mongodb-driver-core.module';
import {
  MongoDbDriverModuleAsyncOptions,
  MongoDbDriverModuleOptions,
} from './interfaces';

@Module({})
export class MongoDbDriverModule {
  public static forRoot(
    options: MongoDbDriverModuleOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: MongoDbDriverModule,
      imports: [MongoDbDriverCoreModule.forRoot(options, connection)],
    };
  }

  public static forRootAsync(
    options: MongoDbDriverModuleAsyncOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: MongoDbDriverModule,
      imports: [MongoDbDriverCoreModule.forRootAsync(options, connection)],
    };
  }
}
