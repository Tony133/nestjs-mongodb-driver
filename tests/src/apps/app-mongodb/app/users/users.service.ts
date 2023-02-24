import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectClient } from '../../../../../../lib';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Db, ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(@InjectClient() private readonly db: Db) {}

  public async findAll(): Promise<unknown> {
    return await this.db.collection('users').find().toArray();
  }

  public async findOne(id: string): Promise<unknown> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException();
    }

    const result = await this.db.collection('users').findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  public async create(createUserDto: CreateUserDto): Promise<unknown> {
    try {
      return await this.db.collection('users').insertOne(createUserDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<unknown> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException();
    }

    try {
      const result = this.db.collection('users').updateOne(
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

    const result = await this.db.collection('users').deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException();
    }
  }
}
