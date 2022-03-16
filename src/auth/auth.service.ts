import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import type { RequestUser } from './req-user';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    return this.usersService.create({
      data: { email, password },
    });
  }

  async validateUser(
    email: string,
    _password: string,
  ): Promise<RequestUser | null> {
    const user = await this.usersService.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, name: true },
    });
    if (user && user.password === _password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: RequestUser) {
    const payload = { sub: user.id, ...user };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
