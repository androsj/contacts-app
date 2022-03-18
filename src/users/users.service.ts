import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async create(params: Prisma.UserCreateArgs): Promise<User> {
    try {
      return await this.db.user.create(params);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'An account associated to this email already exists.',
          );
        }
      }
      throw error;
    }
  }

  async findUnique(params: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return this.db.user.findUnique(params);
  }

  async update(params: Prisma.UserUpdateArgs): Promise<User> {
    return this.db.user.update(params);
  }
}
