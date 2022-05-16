import { MongoDbDriverModuleOptions } from './mongodb-driver-options.interface';

export interface MongoDbDriverOptionsFactory {
  createMongoDbOptions(
    connectionName?: string,
  ): Promise<MongoDbDriverModuleOptions> | MongoDbDriverModuleOptions;
}
