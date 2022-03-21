import { AuthService } from './auth.service';

export const AuthServiceFake = {
  provide: AuthService,
  useFactory: () => ({
    signUp: jest.fn(() => ({})),
    login: jest.fn(() => ({})),
  }),
};
