import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { Contact, Prisma } from '@prisma/client';
import { ReqUser } from 'src/auth/req-user';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async createContact(
    @ReqUser('id') userId: number,
    @Body() data: Omit<Prisma.ContactCreateInput, 'user'>,
  ): Promise<Contact> {
    return this.contactsService.create({
      ...data,
      user: {
        connect: { id: userId },
      },
    });
  }

  @Get()
  async getUserContacts(
    @ReqUser('id') userId: number,
    @Body() args: Prisma.ContactFindManyArgs,
  ): Promise<Contact[]> {
    const {
      where,
      orderBy = {
        name: Prisma.SortOrder.asc,
      },
      ...restArgs
    } = args;

    return this.contactsService.findMany({
      where: {
        ...where,
        userId,
      },
      orderBy,
      ...restArgs,
    });
  }

  @Get(':id')
  async getContactById(
    @ReqUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Contact> {
    const contact = await this.contactsService.findUnique(id);
    if (contact.userId !== userId) {
      throw new UnauthorizedException('You do not have access to this contact');
    }
    return contact;
  }

  @Put(':id')
  async updateContact(
    @ReqUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.ContactUpdateInput,
  ): Promise<Contact> {
    return this.contactsService.update(id, data);
  }

  @Delete(':id')
  async deleteContact(
    @ReqUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Contact> {
    return this.contactsService.delete(id);
  }
}
