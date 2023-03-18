import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { UserUpdateDto } from '../user/dto/update-user.dto';
import { UserCreationDto } from '../user/dto/user-registration.req.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    console.log(req.user);
    return await this.authService.generateToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('hello')
  async getUser(@Request() req): Promise<any> {
    return await this.userService.hello(req.user);
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() userData: UserCreationDto): Promise<any> {
    return this.userService.signup(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update_user')
  updateUser(@Request() req, @Body() reqBody: UserUpdateDto) {
    return this.userService.updateUser(req.user, reqBody);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all_users')
  getAllUsers(@Request() req) {
    return this.userService.getAllUsers(req.user);
  }
}
