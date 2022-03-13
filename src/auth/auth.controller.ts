import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { ReqUser, RequestUser } from './req-user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body) {
    return this.authService.signUp(body.email, body.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@ReqUser() user: RequestUser) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('token-user')
  getProfile(@ReqUser() user: RequestUser) {
    return user;
  }
}
