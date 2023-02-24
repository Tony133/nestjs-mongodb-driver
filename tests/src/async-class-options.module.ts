import { Module } from '@nestjs/common';
import {
  MongoDbDriverModule,
  MongoDbDriverModuleOptions,
  MongoDbDriverOptionsFactory,
} from '../../lib';
import { UsersModule } from './apps/app-mongodb/app/users/users.module';

class ConfigService implements MongoDbDriverOptionsFactory {
  createMongoDbOptions(): MongoDbDriverModuleOptions {
    return {
      url: 'mongodb://localhost:27017/test',
    };
  }
}

@Module({
  imports: [
    MongoDbDriverModule.forRootAsync({
      useClass: ConfigService,
    }),
    MongoDbDriverModule.forRoot({
      url: 'mongodb://localhost:27017/test',
    }),
    UsersModule,
  ],
})
export class AsyncOptionsClassModule {}
