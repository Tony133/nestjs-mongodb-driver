import { Module } from '@nestjs/common';
import { MongoDbDriverModule } from '../../../../../lib';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongoDbDriverModule.forRoot({
      url: 'mongodb://localhost:27017/users',
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
