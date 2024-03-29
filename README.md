<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

MongoDB Native Driver module for Nest framework (node.js) 😻

## Installation

First install the module via `yarn` or `npm` or `pnpm` and do not forget to install the driver package as well:


```bash
    $ npm i --save nest-mongodb-driver mongodb
```
or

```bash
    $ yarn add nest-mongodb-driver mongodb
```
or

```bash
    $ pnpm add nest-mongodb-driver mongodb
```

## Table of Contents

- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Usage](#usage)
  - [MongoDbDriverModule](#mongodbdrivermodule)
  - [MultiConnectionsDatabase](#multi-connections-database)
  - [ExampleOfUse](#example-of-use)

## Usage

### MongoDbDriverModule

MongoDbDriverModule is the primary entry point for this package and can be used synchronously

```typescript
@Module({
  imports: [
    MongoDbDriverModule.forRoot({
        url: 'mongodb://localhost:27017/[:nameDb]',
    }),
  ],
})
```

or asynchronously

```typescript
@Module({
  imports: [
    MongoDbDriverModule.forRootAsync({
      useFactory: () => ({
        url: 'mongodb://localhost:27017/[:nameDb]',
      }),
    }),
  ],
})
```

## Example of use

UsersService:

```typescript
import { Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { InjectClient } from 'nest-mongodb-driver';
import type {
  Document,
} from 'mongodb';

@Injectable()
export class UsersService {
  constructor(@InjectClient() private readonly db: Db) {}

  async findAll(): Promise<Document[]> {
    return await this.db.collection('users').find().toArray();
  }
}
```

UsersController:

```typescript
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import type {
  Document,
} from 'mongodb';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<Document[]> {
    return await this.usersService.findAll();
  }
}
```

## Multi Connections Database

```typescript
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

Usage example with Multi Connection

PostService:

```typescript
@Injectable()
export class PostService {
  constructor(
    @InjectConnection('db2Connection')
    private dbConnection: Db,
  ) {}

  public async findAll(): Promise<Document[]> {
    return await this.dbConnection.collection('posts').find().toArray();
  }

  public async create(createPostDto: CreatePostDto): Promise<InsertOneResult<Document>> {
    try {
      return await this.dbConnection
        .collection('posts')
        .insertOne(createPostDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
```

UsersService:

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectConnection('db1Connection')
    private dbConnection: Db,
  ) {}

  public async findAll(): Promise<Document[]> {
    return await this.dbConnection.collection('users').find().toArray();
  }

  public async create(createUserDto: CreateUserDto): Promise<InsertOneResult<Document>> {
    try {
      return await this.dbConnection
        .collection('users')
        .insertOne(createUserDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
```

For more information on `MongoDB NodeJS Driver` see [here](https://www.mongodb.com/docs/drivers/node/current/)

## Contribute
Feel free to help this library, I'm quite busy with also another Nestjs packages, but the community will appreciate the effort of improving this library. Make sure you follow the guidelines

## Stay in touch

- Author - [Tony133](https://github.com/Tony133)
- Framework - [https://nestjs.com](https://nestjs.com/)

## License

 [MIT licensed](LICENSE)
