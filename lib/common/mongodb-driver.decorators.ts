import { Inject } from '@nestjs/common';
import { MongoDbDriverModuleOptions } from '../interfaces/mongodb-driver-options.interface';
import { getConnectionToken } from './mongodb-driver.utils';

export const InjectClient = (connection?: string) => {
  return Inject(getConnectionToken(connection));
};

export const InjectDb = (connection?: string) => {
  return Inject(getConnectionToken(connection));
};

export const InjectConnection: (
  connection?: MongoDbDriverModuleOptions | string,
) => ParameterDecorator = (connection?: MongoDbDriverModuleOptions | string) =>
  Inject(getConnectionToken(connection));
