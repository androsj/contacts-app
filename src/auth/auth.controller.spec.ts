import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceFake } from './auth.service.mock';
import { faker } from '@faker-js/faker';
import { RequestUser } from './req-user';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthServiceFake],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call signUp from the service', async () => {
      const body = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      await controller.signUp(body);
      expect(authService.signUp).toHaveBeenCalledWith(
        body.email,
        body.password,
      );
    });
  });

  describe('login', () => {
    it('should call login from the service', async () => {
      const user: RequestUser = {
        id: faker.datatype.number(),
        email: faker.internet.email(),
        name: faker.name.findName(),
      };
      await controller.login(user);
      expect(authService.login).toHaveBeenCalledWith(user);
    });
  });
});
