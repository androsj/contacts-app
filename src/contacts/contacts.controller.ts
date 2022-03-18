import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Contact, Prisma } from '@prisma/client';
import { ReqUser, RequestUser } from 'src/auth/req-user';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async createContact(
    @ReqUser('id') userId: number,
    @Body() data: ContactCreateBody,
  ): Promise<Contact> {
    const { name, email, phones } = data;

    return this.contactsService.create({
      ...(phones && { include: { phones: true } }),
      data: {
        name,
        email,
        ...(phones && {
          phones: {
            createMany: {
              data: phones,
            },
          },
        }),
        user: {
          connect: { id: userId },
        },
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
    @ReqUser() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Contact> {
    const contact = await this.contactsService.findUnique({
      where: { id },
    });

    this.contactsService.assertUserCanAccess({ contact, user });

    return contact;
  }

  @Put(':id')
  async updateContact(
    @ReqUser() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ContactUpdateBody,
  ): Promise<Contact> {
    const { name, email } = data;

    await this.contactsService.findAndAssertUserCanAccess({
      user,
      where: { id },
    });

    return this.contactsService.update({
      where: { id },
      data: {
        name,
        email,
      },
    });
  }

  @Delete(':id')
  async deleteContact(
    @ReqUser() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Contact> {
    await this.contactsService.findAndAssertUserCanAccess({
      user,
      where: { id },
    });

    return this.contactsService.delete({ where: { id } });
  }
}

type ContactCreateBody = Omit<
  Prisma.ContactCreateInput,
  'createdAt' | 'updatedAt' | 'user' | 'phones'
> & {
  phones?: Array<
    Omit<Prisma.ContactPhoneCreateInput, 'createdAt' | 'updatedAt' | 'contact'>
  >;
};

type ContactUpdateBody = Omit<
  Prisma.ContactUpdateInput,
  'createdAt' | 'updatedAt' | 'user' | 'phones'
>;
