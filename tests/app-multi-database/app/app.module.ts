import { Module } from '@nestjs/common';
import { MongoDbDriverModule } from '../../../lib';
import { PostModule } from './post/post.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongoDbDriverModule.forRootAsync(
      {
        useFactory: () => ({
          url: 'mongodb://localhost:27017/test1',
        }),
      },
      'db1Connection',
    ),
    MongoDbDriverModule.forRootAsync(
      {
        useFactory: () => ({
          url: 'mongodb://localhost:27018/test2',
        }),
      },
      'db2Connection',
    ),
    UsersModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
