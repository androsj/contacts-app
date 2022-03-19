import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { RequestUser } from '../auth/req-user';
import { BadRequestException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('ContactsController', () => {
  let controller: ContactsController;
  let contactsService: ContactsService;

  const user: RequestUser = {
    id: faker.datatype.number(),
    email: faker.internet.email(),
    name: faker.name.findName(),
  };

  beforeEach(async () => {
    const ContactsServiceFake = {
      provide: ContactsService,
      useFactory: () => ({
        assertUserCanAccess: jest.fn(() => void 0),
        findAndAssertUserCanAccess: jest.fn(() => ({})),
        create: jest.fn(() => ({})),
        findMany: jest.fn(() => []),
        findUnique: jest.fn(() => ({})),
        update: jest.fn(() => ({})),
        delete: jest.fn(() => ({})),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [ContactsService, ContactsServiceFake],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    contactsService = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createContact', () => {
    it('should call create from the service', async () => {
      const params = {
        name: faker.name.findName(),
      };
      await controller.createContact(user.id, params);
      expect(contactsService.create).toHaveBeenCalled();
    });

    it('should throw a BadRequest if name is missing', async () => {
      const params = {} as any;
      try {
        await controller.createContact(user.id, params);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('getContacts', () => {
    it('should call findMany from the service', async () => {
      await controller.getUserContacts(user.id);
      expect(contactsService.findMany).toHaveBeenCalled();
    });
  });

  describe('getContactById', () => {
    it('should call findUnique from the service', async () => {
      const id = faker.datatype.number();
      await controller.getContactById(user, id);
      expect(contactsService.findUnique).toHaveBeenCalled();
    });
  });

  describe('updateContact', () => {
    it('should call update from the service', async () => {
      const id = faker.datatype.number();
      const data = { name: faker.name.findName() };
      await controller.updateContact(user, id, data);
      expect(contactsService.update).toHaveBeenCalled();
    });
  });

  describe('deleteContact', () => {
    it('should call delete from the service', async () => {
      const id = faker.datatype.number();
      await controller.deleteContact(user, id);
      expect(contactsService.delete).toHaveBeenCalled();
    });
  });
});
