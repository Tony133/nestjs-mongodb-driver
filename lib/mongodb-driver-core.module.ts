import {
  Global,
  Module,
  DynamicModule,
  Provider,
  Type,
  OnApplicationShutdown,
  Inject,
} from '@nestjs/common';
import {
  MongoDbDriverModuleAsyncOptions,
  MongoDbDriverModuleOptions,
  MongoDbDriverOptionsFactory,
} from './interfaces';
import { getConnectionToken, handleRetry } from './common/mongodb-driver.utils';
import { MONGODB_DRIVER_MODULE_OPTIONS } from './mongodb-driver.constants';
import { Db, MongoClient } from 'mongodb';
import { ModuleRef } from '@nestjs/core';
import { defer, lastValueFrom } from 'rxjs';

@Global()
@Module({})
export class MongoDbDriverCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(MONGODB_DRIVER_MODULE_OPTIONS)
    private readonly options: MongoDbDriverModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  public static forRoot(
    options: MongoDbDriverModuleOptions,
    connection?: string,
  ): DynamicModule {
    const knexModuleOptions = {
      provide: MONGODB_DRIVER_MODULE_OPTIONS,
      useValue: options,
    };

    const connectionProvider: Provider = {
      provide: getConnectionToken(connection),
      useFactory: async () => await this.createConnectionFactory(options),
    };

    return {
      module: MongoDbDriverCoreModule,
      providers: [connectionProvider, knexModuleOptions],
      exports: [connectionProvider],
    };
  }

  public static forRootAsync(
    options: MongoDbDriverModuleAsyncOptions,
    connection: string,
  ): DynamicModule {
    const connectionProvider: Provider = {
      provide: getConnectionToken(connection),
      useFactory: async (options: MongoDbDriverModuleOptions) => {
        return await this.createConnectionFactory(options);
      },
      inject: [MONGODB_DRIVER_MODULE_OPTIONS],
    };

    return {
      module: MongoDbDriverCoreModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), connectionProvider],
      exports: [connectionProvider],
    };
  }

  async onApplicationShutdown(): Promise<any> {
    const connection = this.moduleRef.get<MongoClient>(
      getConnectionToken(
        this.options as MongoDbDriverModuleOptions,
      ) as Type<MongoClient>,
    );
    connection && (await connection.close);
  }

  public static createAsyncProviders(
    options: MongoDbDriverModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<MongoDbDriverOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  public static createAsyncOptionsProvider(
    options: MongoDbDriverModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MONGODB_DRIVER_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // `as Type<MongoDbDriverOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass ||
        options.useExisting) as Type<MongoDbDriverOptionsFactory>,
    ];

    return {
      provide: MONGODB_DRIVER_MODULE_OPTIONS,
      useFactory: async (
        optionsFactory: MongoDbDriverOptionsFactory,
      ): Promise<MongoDbDriverModuleOptions> => {
        return await optionsFactory.createMongoDbOptions();
      },
      inject,
    };
  }

  private static async createConnectionFactory(
    options: MongoDbDriverModuleOptions,
  ): Promise<Db> {
    return lastValueFrom(
      defer(async () => {
        const client = new MongoClient(options.url, options.clientOptions);
        await client.connect();
        const db = await client.db(options.dbName);
        return db;
      }).pipe(handleRetry(options.retryAttempts, options.retryDelay)),
    );
  }
}
