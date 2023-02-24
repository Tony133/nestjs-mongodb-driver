import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { InjectConnection } from '../../../../lib';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection('db1Connection')
    private dbConnection: Db,
  ) {}

  public async findAll(): Promise<any> {
    return await this.dbConnection.collection('users').find().toArray();
  }

  public async findOne(id: string): Promise<any> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException();
    }

    const result = await this.dbConnection.collection('users').findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  public async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      return await this.dbConnection
        .collection('users')
        .insertOne(createUserDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException();
    }

    try {
      const result = this.dbConnection.collection('users').updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            ...updateUserDto,
          },
        },
      );

      return result;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException();
    }

    const result = await this.dbConnection.collection('users').deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException();
    }
  }
}
