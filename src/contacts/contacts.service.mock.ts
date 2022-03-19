import { ContactsService } from './contacts.service';

export const ContactsServiceFake = {
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
