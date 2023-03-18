import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from 'src/app.utils';
import { Transaction } from '../wallet/entities/transaction.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { WalletModule } from '../wallet/wallet.module';
import { WalletService } from '../wallet/wallet.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    WalletModule,
    TypeOrmModule.forFeature([User, Wallet, Transaction]),
  ],
  controllers: [UserController],
  providers: [UserService, WalletService, Verification],
  exports: [UserModule],
})
export class UserModule {}
