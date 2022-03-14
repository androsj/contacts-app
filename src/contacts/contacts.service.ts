import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Contact, Prisma } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: Prisma.ContactCreateInput): Promise<Contact> {
    return this.db.contact.create({
      data,
    });
  }

  async findMany(args?: Prisma.ContactFindManyArgs): Promise<Contact[]> {
    return this.db.contact.findMany(args);
  }

  async findUnique(id: number): Promise<Contact> {
    const contact = await this.db.contact.findUnique({
      where: { id },
    });
    if (!contact) {
      throw new NotFoundException('Contact was not found');
    }
    return contact;
  }

  async update(id: number, data: Prisma.ContactUpdateInput): Promise<Contact> {
    return this.db.contact.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Contact> {
    return this.db.contact.delete({
      where: { id },
    });
  }
}
