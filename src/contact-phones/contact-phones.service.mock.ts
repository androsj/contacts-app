import { ContactPhonesService } from './contact-phones.service';

export const ContactPhonesServiceFake = {
  provide: ContactPhonesService,
  useFactory: () => ({
    findAndAssertUserCanAccess: jest.fn(() => ({})),
    create: jest.fn(() => ({})),
    findMany: jest.fn(() => []),
    findUnique: jest.fn(() => ({})),
    update: jest.fn(() => ({})),
    delete: jest.fn(() => ({})),
  }),
};
