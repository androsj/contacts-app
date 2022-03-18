import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactsService } from '../contacts/contacts.service';
import { DatabaseService } from '../database/database.service';
import { ContactPhone, Prisma } from '@prisma/client';
import type { WithUser } from '../auth/req-user';

@Injectable()
export class ContactPhonesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly contactsService: ContactsService,
  ) {}

  async findAndAssertUserCanAccess(
    params: WithUser<Prisma.ContactPhoneFindUniqueArgs>,
  ) {
    const { user, where } = params;

    const contactPhone = await this.db.contactPhone.findUnique({
      where,
      select: {
        id: true,
        contact: {
          select: { userId: true },
        },
      },
    });

    if (!contactPhone) {
      throw new NotFoundException('Contact phone was not found');
    }

    this.contactsService.assertUserCanAccess({
      contact: contactPhone.contact,
      user,
    });

    return contactPhone;
  }

  async create(params: Prisma.ContactPhoneCreateArgs): Promise<ContactPhone> {
    return this.db.contactPhone.create(params);
  }

  async findMany(
    params?: Prisma.ContactPhoneFindManyArgs,
  ): Promise<ContactPhone[]> {
    return this.db.contactPhone.findMany(params);
  }

  async findUnique(
    params: Prisma.ContactPhoneFindUniqueArgs,
  ): Promise<ContactPhone> {
    const contactPhone = await this.db.contactPhone.findUnique(params);

    if (!contactPhone) {
      throw new NotFoundException('Contact phone was not found');
    }

    return contactPhone;
  }

  async update(params: Prisma.ContactPhoneUpdateArgs): Promise<ContactPhone> {
    return this.db.contactPhone.update(params);
  }

  async delete(params: Prisma.ContactPhoneDeleteArgs): Promise<ContactPhone> {
    return this.db.contactPhone.delete(params);
  }
}
