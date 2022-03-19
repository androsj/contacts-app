import { Test, TestingModule } from '@nestjs/testing';
import { ContactPhonesController } from './contact-phones.controller';
import { ContactPhonesServiceFake } from './contact-phones.service.mock';
import { ContactsServiceFake } from '../contacts/contacts.service.mock';
import { faker } from '@faker-js/faker';
import { RequestUser } from '../auth/req-user';
import { ContactPhonesService } from './contact-phones.service';
import { BadRequestException } from '@nestjs/common';
import { ContactsService } from '../contacts/contacts.service';

describe('ContactPhonesController', () => {
  let controller: ContactPhonesController;
  let contactPhonesService: ContactPhonesService;
  let contactsService: ContactsService;

  const user: RequestUser = {
    id: faker.datatype.number(),
    email: faker.internet.email(),
    name: faker.name.findName(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactPhonesController],
      providers: [ContactPhonesServiceFake, ContactsServiceFake],
    }).compile();

    controller = module.get<ContactPhonesController>(ContactPhonesController);
    contactPhonesService =
      module.get<ContactPhonesService>(ContactPhonesService);
    contactsService = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createContactPhone', () => {
    it('should call create from the service', async () => {
      const params = {
        contactId: faker.datatype.number(),
        phone: faker.phone.phoneNumber(),
      };
      await controller.createContactPhone(user, params);

      expect(contactsService.findAndAssertUserCanAccess).toHaveBeenCalled();
      expect(contactPhonesService.create).toHaveBeenCalled();
    });

    it('should throw a BadRequest if phone is missing', async () => {
      const params = { contactId: faker.datatype.number() } as any;
      try {
        await controller.createContactPhone(user, params);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw a BadRequest if contactId is missing', async () => {
      const params = { phone: faker.phone.phoneNumber() } as any;
      try {
        await controller.createContactPhone(user, params);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('getContactPhones', () => {
    it('should call findMany from the service', async () => {
      const id = faker.datatype.number();
      await controller.getContactPhones(user, id);

      expect(contactsService.findAndAssertUserCanAccess).toHaveBeenCalled();
      expect(contactPhonesService.findMany).toHaveBeenCalled();
    });
  });

  describe('getContactPhoneById', () => {
    it('should call findUnique from the service', async () => {
      const id = faker.datatype.number();
      await controller.getContactPhoneById(user, id);

      expect(contactPhonesService.findUnique).toHaveBeenCalled();
      expect(contactsService.assertUserCanAccess).toHaveBeenCalled();
    });
  });

  describe('updateContactPhone', () => {
    it('should call update from the service', async () => {
      const id = faker.datatype.number();
      const data = { phone: faker.phone.phoneNumber() };
      await controller.updateContactPhone(user, id, data);

      expect(
        contactPhonesService.findAndAssertUserCanAccess,
      ).toHaveBeenCalled();
      expect(contactPhonesService.update).toHaveBeenCalledWith({
        data,
        where: { id },
      });
    });
  });

  describe('deleteContactPhone', () => {
    it('should call delete from the service', async () => {
      const id = faker.datatype.number();
      await controller.deleteContactPhone(user, id);

      expect(
        contactPhonesService.findAndAssertUserCanAccess,
      ).toHaveBeenCalled();
      expect(contactPhonesService.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
