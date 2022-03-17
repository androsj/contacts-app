import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Contact, Prisma } from '@prisma/client';
import type { RequestUser, WithUser } from 'src/auth/req-user';

@Injectable()
export class ContactsService {
  constructor(private readonly db: DatabaseService) {}

  assertUserCanAccess(params: {
    contact: Pick<Contact, 'userId'>;
    user: RequestUser;
  }) {
    if (params.contact.userId !== params.user.id) {
      throw new UnauthorizedException('You do not have access to this contact');
    }
  }

  async create(params: Prisma.ContactCreateArgs): Promise<Contact> {
    return this.db.contact.create(params);
  }

  async findMany(params?: Prisma.ContactFindManyArgs): Promise<Contact[]> {
    return this.db.contact.findMany(params);
  }

  async findUnique(params: Prisma.ContactFindUniqueArgs): Promise<Contact> {
    const contact = await this.db.contact.findUnique(params);

    if (!contact) {
      throw new NotFoundException('Contact was not found');
    }

    return contact;
  }

  async findAndAssertUserCanAccess(
    params: WithUser<Prisma.ContactFindUniqueArgs>,
  ): Promise<Contact> {
    const { user, ...uniqueParams } = params;

    const contact = await this.findUnique({
      select: { id: true, userId: true },
      ...uniqueParams,
    });

    this.assertUserCanAccess({ contact, user });

    return contact;
  }

  async update(params: Prisma.ContactUpdateArgs): Promise<Contact> {
    return this.db.contact.update(params);
  }

  async delete(params: Prisma.ContactDeleteArgs): Promise<Contact> {
    return this.db.contact.delete(params);
  }
}
