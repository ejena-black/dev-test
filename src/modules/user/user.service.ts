import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreationDto } from './dto/user-registration.req.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Verification } from 'src/app.utils';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private walletService: WalletService,
    private verification: Verification,
  ) {}

  // Signup User
  async signup(userDetails: UserCreationDto) {
    const { password, email, ...userData } = userDetails;

    // check if user exists
    const exists = await this.getUserByEmail(email);
    if (exists)
      throw new BadRequestException({
        message: 'A user with this email already exists',
      });

    const hashed = await bcrypt.hash(password, 10);
    const fixedData = { password: hashed, email, ...userData };
    const newUser = await this.userRepository.save(fixedData);

    // create wallet for user
    await this.walletService.createUserWallet(newUser.id);

    // new User
    return newUser;
  }

  // validate user for authService
  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  // get all users for all_users route
  async getAllUsers(reqUser: object): Promise<any> {
    await this.verification.verifyAdmin(reqUser);

    const allUsers = await this.userRepository.find();

    return allUsers.map((user) => {
      const { password, ...data } = user;
      const userNoPassword = { ...data };
      return userNoPassword;
    });
  }

  // update user address
  async updateUser(userInfo, newAddress) {
    await this.verification.verifyAdmin(userInfo);

    const address = newAddress.address;

    const foundUser = await this.userRepository.findOneBy(userInfo.id);

    return await this.userRepository.save({
      ...foundUser,
      address: address,
    });
  }

  async hello(reqUser) {
    await this.verification.verifyUser(reqUser);

    const wallet = await this.walletService.getUserWalletById(reqUser.id);

    return {
      balance: wallet.balance,
      transactions: wallet.transactions,
    };
  }
}
