import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new BadRequestException();

    if (!bcrypt.compare(password, user.password))
      throw new UnauthorizedException();

    return user;
  }

  async generateToken(user: any) {
    return {
      access_token: this.jwtService.sign({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        role: user.role,
        sub: user.id,
      }),
    };
  }
}
