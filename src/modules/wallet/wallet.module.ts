import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './wallet.service';
import { Transaction } from './entities/transaction.entity';
import { Verification } from 'src/app.utils';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [WalletController],
  providers: [WalletService, Verification],
  exports: [WalletModule],
})
export class WalletModule {}
