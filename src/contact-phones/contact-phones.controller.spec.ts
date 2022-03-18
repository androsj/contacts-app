import { Test, TestingModule } from '@nestjs/testing';
import { ContactPhonesController } from './contact-phones.controller';

describe('ContactPhonesController', () => {
  let controller: ContactPhonesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactPhonesController],
    }).compile();

    controller = module.get<ContactPhonesController>(ContactPhonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
