import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppRootModule } from '../src/app.module';

// process.env.DESTROY_SOCKETS = 'true';

describe('TuiyouController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppRootModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  it('/createUser (GQL)', async () => {
    const mut = `
    mutation {
      createUser(createUserInput: { username: "test", password: "test",nickname:"sage" }) {
        username
      }
    }
  `;
    const loginResponse = await request(server)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({ query: mut });

    console.log(loginResponse.status, loginResponse.body);
  });

  it('/login (POST)', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({ username: 'test', password: 'test' });

    console.log(response.status, response.body);

    // expect(response.headers["Content-Type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    // expect(response.body.email).toEqual('foo@bar.com');

    //   return request(app.getHttpServer())
    //     .post('/auth/login')
    //     .send({ username: 'zhangsan2', password: '123456' })
    //     .expect(function(res) {
    //       res.body.id = 'some fixed id';
    //       res.body.name = res.body.name.toLowerCase();
    //     })
    //     .expect(200)
    //     .expect('Hello World!');
  });

  afterAll(async () => {
    await server.close();
    await app.close();
  });
});
