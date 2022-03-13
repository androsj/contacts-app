import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const newUser = await this.db.user.create({
        data,
      });
      return newUser;
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

  async findUnique(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    args?: Omit<Prisma.UserFindUniqueArgs, 'where'>,
  ): Promise<User | null> {
    return this.db.user.findUnique({
      where: userWhereUniqueInput,
      ...args,
    });
  }
}
