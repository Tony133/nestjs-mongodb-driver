import { DynamicModule, Module } from '@nestjs/common';
import { MongoDbDriverModule } from '../../lib';

@Module({})
export class DatabaseModule {
  static async forRoot(): Promise<DynamicModule> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      module: DatabaseModule,
      imports: [
        MongoDbDriverModule.forRoot(
          {
            name: 'db1Connection',
            url: 'mongodb://localhost:27017/test',
          },
          'db1Connection',
        ),
        MongoDbDriverModule.forRoot(
          {
            name: 'db2Connection',
            url: 'mongodb://localhost:27017/test',
          },
          'db2Connection',
        ),
      ],
    };
  }
}
