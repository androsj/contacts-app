import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Contact, ContactPhone, Prisma } from '@prisma/client';
import { ReqUser, RequestUser } from '../auth/req-user';
import { ContactsService } from '../contacts/contacts.service';
import { ContactPhonesService } from './contact-phones.service';

@Controller('contact-phones')
export class ContactPhonesController {
  constructor(
    private readonly contactPhonesService: ContactPhonesService,
    private readonly contactsService: ContactsService,
  ) {}

  @Post()
  async createContactPhone(
    @ReqUser() user: RequestUser,
    @Body() data: ContactPhoneCreateBody,
  ): Promise<ContactPhone> {
    const { contactId, phone, type } = data;

    if (!contactId) {
      throw new BadRequestException('contactId is required');
    }
    if (!phone) {
      throw new BadRequestException('phone is required');
    }

    await this.contactsService.findAndAssertUserCanAccess({
      user,
      where: { id: contactId },
    });

    return this.contactPhonesService.create({
      data: {
        phone,
        type,
        contact: {
          connect: { id: contactId },
        },
      },
    });
  }

  @Get()
  async getContactPhones(
    @ReqUser() user: RequestUser,
    @Query('contactId', ParseIntPipe) contactId: number,
    @Body() args?: Prisma.ContactPhoneFindManyArgs,
  ): Promise<ContactPhone[]> {
    const { where, ...restArgs } = args || {};

    await this.contactsService.findAndAssertUserCanAccess({
      user,
      where: { id: contactId },
    });

    return this.contactPhonesService.findMany({
      where: {
        ...where,
        contactId,
      },
      ...restArgs,
    });
  }

  @Get(':id')
  async getContactPhoneById(
    @ReqUser() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContactPhone & { contact: Pick<Contact, 'userId'> }> {
    const contactPhone = (await this.contactPhonesService.findUnique({
      where: { id },
      include: { contact: { select: { userId: true } } },
    })) as ContactPhone & { contact: Pick<Contact, 'userId'> };

    this.contactsService.assertUserCanAccess({
      contact: contactPhone.contact,
      user,
    });

    return contactPhone;
  }

  @Put(':id')
  async updateContactPhone(
    @ReqUser() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ContactPhoneUpdateBody,
  ): Promise<ContactPhone> {
    const { phone, type } = data;

    await this.contactPhonesService.findAndAssertUserCanAccess({
      user,
      where: { id },
    });

    return this.contactPhonesService.update({
      where: { id },
      data: {
        phone,
        type,
      },
    });
  }

  @Delete(':id')
  async deleteContactPhone(
    @ReqUser() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContactPhone> {
    await this.contactPhonesService.findAndAssertUserCanAccess({
      user,
      where: { id },
    });

    return this.contactPhonesService.delete({ where: { id } });
  }
}

type ContactPhoneCreateBody = Omit<
  Prisma.ContactPhoneCreateInput,
  'createdAt' | 'updatedAt' | 'contact'
> & {
  contactId: number;
};

type ContactPhoneUpdateBody = Omit<
  Prisma.ContactPhoneUpdateInput,
  'createdAt' | 'updatedAt' | 'contact'
>;
