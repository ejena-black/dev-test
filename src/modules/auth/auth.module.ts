import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from 'src/app.utils';
import { jwtConfig } from 'src/config/jwt.config';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { Transaction } from '../wallet/entities/transaction.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { WalletModule } from '../wallet/wallet.module';
import { WalletService } from '../wallet/wallet.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    WalletModule,
    TypeOrmModule.forFeature([User, Wallet, Transaction]),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    WalletService,
    Verification,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
