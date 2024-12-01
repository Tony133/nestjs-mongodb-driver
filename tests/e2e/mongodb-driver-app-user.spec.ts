import { HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersModule } from '../src/apps/app-mongodb/app/users/users.module';
import { MongoDbDriverModule } from '../../lib';
import * as request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

describe('MongoDB Driver [Feature] Test App User - /user', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        MongoDbDriverModule.forRoot({
          url: 'mongodb://localhost:27017/test',
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('should create new user [POST /user]', () => {
    return request(app.getHttpServer())
      .post('/user')
      .expect(HttpStatus.CREATED)
      .set('Accept', 'application/json')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
      })
      .then(({ body }) => {
        expect(body).toEqual({
          acknowledged: body.acknowledged,
          insertedId: body.insertedId,
        });
      });
  });

  it('should get all users [GET /user]', () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Accept', 'application/json')
      .then(({ body }) => {
        expect(body).toEqual([
          {
            _id: body[0]._id,
            firstName: 'firstName',
            lastName: 'lastName',
          },
        ]);
        expect(HttpStatus.OK);
      });
  });

  it('should update a user by id [PUT /user/:id]', () => {
    return request(app.getHttpServer())
      .put('/user/63f8bf89daf89e1697e7fcf3')
      .expect(HttpStatus.OK)
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
      })
      .then(({ body }) => {
        expect(body).toEqual({
          acknowledged: body.acknowledged,
          matchedCount: body.matchedCount,
          modifiedCount: body.modifiedCount,
          upsertedCount: body.upsertedCount,
          upsertedId: body.upsertedId,
        });
      });
  });

  it('should delete a user by id [DELETE /user/:id]', () => {
    return request(app.getHttpServer())
      .delete('/user/63f8bf89daf89e1697e7fcf3')
      .then(() => {
        return request(app.getHttpServer())
          .get('/user/63f8bf89daf89e1697e7fcf3')
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
