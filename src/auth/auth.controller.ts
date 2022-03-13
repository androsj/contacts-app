import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';
import { ReqUser, RequestUser } from './req-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() body) {
    return this.authService.signUp(body.email, body.password);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@ReqUser() user: RequestUser) {
    return this.authService.login(user);
  }

  @Get('token-user')
  getProfile(@ReqUser() user: RequestUser) {
    return user;
  }
}
