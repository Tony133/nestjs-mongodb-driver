import { Module } from '@nestjs/common';
import { MongoDbDriverModule } from '../../lib';
import { UsersModule } from './apps/app-mongodb/app/users/users.module';

@Module({
  imports: [
    MongoDbDriverModule.forRoot({
      url: 'mongodb://localhost:27017/test',
    }),
    UsersModule,
  ],
})
export class ApplicationModule {}
