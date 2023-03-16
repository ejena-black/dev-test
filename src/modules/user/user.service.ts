import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreationDto } from './dto/user-registration.req.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Signup User
  async signup(userDetails: UserCreationDto) {
    const { password, ...userData } = userDetails;
    const hashed = await bcrypt.hash(password, 10);
    const newUser = { password: hashed, ...userData };

    return await this.userRepository.save(newUser);
  }

  // get User to validateUser for authService
  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  // get all users for all_users route
  async getAllUsers(reqUser: object): Promise<any> {
    await this.verifyAdmin(reqUser);

    const allUsers = await this.userRepository.find();

    return allUsers.map((user) => {
      const { password, ...data } = user;
      const userNoPassword = { ...data };
      return userNoPassword;
    });
  }

  // update user address
  async updateUser(userInfo, newAddress) {
    await this.verifyUser(userInfo);

    const address = newAddress.address;

    const foundUser = await this.userRepository.findOneBy(userInfo.id);

    return await this.userRepository.save({
      ...foundUser,
      address: address,
    });
  }

  async verifyUser(payload: any) {
    if (payload.role === 'admin') throw new UnauthorizedException();

    return {
      id: payload.sub,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      address: payload.address,
      role: payload.role,
    };
  }

  async verifyAdmin(payload: any) {
    if (payload.role === 'user') throw new UnauthorizedException();

    return {
      id: payload.sub,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      address: payload.address,
      role: payload.role,
    };
  }
}
