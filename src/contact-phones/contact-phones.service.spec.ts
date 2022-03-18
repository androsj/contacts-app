import { Test, TestingModule } from '@nestjs/testing';
import { ContactPhonesService } from './contact-phones.service';

describe('ContactPhonesService', () => {
  let service: ContactPhonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactPhonesService],
    }).compile();

    service = module.get<ContactPhonesService>(ContactPhonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
