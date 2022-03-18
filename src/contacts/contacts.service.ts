import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Contact, Prisma } from '@prisma/client';
import type { RequestUser, WithUser } from '../auth/req-user';

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

  async findAndAssertUserCanAccess(
    params: WithUser<Prisma.ContactFindUniqueArgs>,
  ) {
    const { user, where } = params;

    const contact = await this.db.contact.findUnique({
      where,
      select: { id: true, userId: true },
    });

    if (!contact) {
      throw new NotFoundException('Contact was not found');
    }

    this.assertUserCanAccess({ contact, user });

    return contact;
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

  async update(params: Prisma.ContactUpdateArgs): Promise<Contact> {
    return this.db.contact.update(params);
  }

  async delete(params: Prisma.ContactDeleteArgs): Promise<Contact> {
    return this.db.contact.delete(params);
  }
}
