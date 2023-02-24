import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AsyncOptionsClassModule } from '../src/async-class-options.module';
import * as request from 'supertest';

describe('MongoDB driver (async configuration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncOptionsClassModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`should return created entity`, () => {
    return request(app.getHttpServer())
      .post('/user')
      .expect(HttpStatus.CREATED)
      .set('Accept', 'application/json')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
      })
      .expect(({ body }) => {
        expect(body).toEqual({
          acknowledged: body.acknowledged,
          insertedId: body.insertedId,
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
