import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { MongoDbDriverModuleOptions } from './mongodb-driver-options.interface';
import { MongoDbDriverOptionsFactory } from './mongodb-driver-options-factory.interface';

export interface MongoDbDriverModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  inject?: any[];
  useClass?: Type<MongoDbDriverOptionsFactory>;
  useExisting?: Type<MongoDbDriverOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<MongoDbDriverModuleOptions> | MongoDbDriverModuleOptions;
}
