import { Module } from '@nestjs/common';
import {
  MongoDbDriverModule,
  MongoDbDriverOptionsFactory,
  MongoDbDriverModuleOptions,
} from '../../lib';
import { UsersModule } from '../src/apps/app-mongodb/app/users/users.module';

class ConfigService implements MongoDbDriverOptionsFactory {
  createMongoDbOptions(): MongoDbDriverModuleOptions {
    return {
      url: 'mongodb://localhost:27017/test',
    };
  }
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}

@Module({
  imports: [
    MongoDbDriverModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    MongoDbDriverModule.forRoot({
      url: 'mongodb://localhost:27017/test',
    }),
    UsersModule,
  ],
})
export class AsyncOptionsExistingModule {}
