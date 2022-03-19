import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { RequestUser } from '../auth/req-user';
import { BadRequestException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ContactsServiceFake } from './contacts.service.mock';

describe('ContactsController', () => {
  let controller: ContactsController;
  let contactsService: ContactsService;

  const user: RequestUser = {
    id: faker.datatype.number(),
    email: faker.internet.email(),
    name: faker.name.findName(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [ContactsServiceFake],
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

      expect(contactsService.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(contactsService.assertUserCanAccess).toHaveBeenCalled();
    });
  });

  describe('updateContact', () => {
    it('should call update from the service', async () => {
      const id = faker.datatype.number();
      const data = { name: faker.name.findName() };
      await controller.updateContact(user, id, data);

      expect(contactsService.findAndAssertUserCanAccess).toHaveBeenCalled();
      expect(contactsService.update).toHaveBeenCalledWith({
        data,
        where: { id },
      });
    });
  });

  describe('deleteContact', () => {
    it('should call delete from the service', async () => {
      const id = faker.datatype.number();
      await controller.deleteContact(user, id);

      expect(contactsService.findAndAssertUserCanAccess).toHaveBeenCalled();
      expect(contactsService.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
