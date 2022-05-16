export interface MongoDbDriverModuleOptions {
  name?: string;
  url: string;
  clientOptions?: any;
  dbName?: string;
  retryAttempts?: number;
  retryDelay?: number;
}
