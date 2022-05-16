import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotFoundException } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { InjectConnection } from '../../../../lib';

@Injectable()
export class PostService {
  constructor(
    @InjectConnection('db2Connection')
    private dbConnection: Db,
  ) {}

  public async findAll(): Promise<any> {
    return await this.dbConnection.collection('posts').find().toArray();
  }

  public async findOne(id: string): Promise<any> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException();
    }

    const result = await this.dbConnection.collection('posts').findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  public async create(createPostDto: CreatePostDto): Promise<any> {
    try {
      return await this.dbConnection
        .collection('posts')
        .insertOne(createPostDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: string, updatePostDto: UpdatePostDto): Promise<any> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException();
    }

    try {
      const result = this.dbConnection.collection('posts').updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            ...updatePostDto,
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

    const result = await this.dbConnection.collection('posts').deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException();
    }
  }
}
