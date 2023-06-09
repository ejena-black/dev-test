import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Transaction } from 'src/modules/wallet/entities/transaction.entity';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import { User } from '../modules/user/user.entity';

export default class TypreOrmConfig {
  static getOrmConfigs(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [User, Wallet, Transaction],
      synchronize: configService.get('PROD'),
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> =>
    TypreOrmConfig.getOrmConfigs(configService),
  inject: [ConfigService],
};
