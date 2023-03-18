import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Verification } from 'src/app.utils';
import { Repository } from 'typeorm';
import { WalletTransactionDto } from './dto/wallet-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private verification: Verification,
  ) {}

  // Generate transaction Ref
  async generateTransactionRef(user) {
    const { firstName } = user;
    const name = await firstName.slice(0, 3);

    const timeStamp = new Date().getTime();
    const ref = name + timeStamp;
    return ref;
  }

  // Create wallet for user
  async createUserWallet(userId) {
    const wallet = new Wallet();
    wallet.user = userId;
    wallet.balance = 0;

    return await wallet.save();
  }

  // Fund wallet
  async fundWallet(
    id: number,
    fundDetails: WalletTransactionDto,
  ): Promise<Wallet> {
    const wallet = await this.getUserWalletById(id);
    await this.createNewTransaction(fundDetails, wallet);

    // update to wallet balance
    const newBalance = (wallet.balance += Number(fundDetails.amount));

    return await Wallet.save({
      ...wallet,
      balance: newBalance,
    });
  }

  // Debit user wallet
  async debitWallet(id: number, debitDetails: WalletTransactionDto) {
    const wallet = await this.getUserWalletById(id);
    await this.createNewTransaction(debitDetails, wallet);

    if (debitDetails.amount > wallet.balance)
      throw new BadRequestException({
        message: 'You do not have sufficient balance in your wallet',
      });

    // update to wallet balance
    const newBalance = (wallet.balance -= Number(debitDetails.amount));

    // const updateWallet =

    return await Wallet.save({
      ...wallet,
      balance: newBalance,
    });
  }

  // get user-wallet by id
  async getUserWalletById(id: number): Promise<Wallet> {
    const userWallet = await Wallet.findOne({
      where: { id },
      relations: ['transactions'],
    });
    // console.log(relations);

    return userWallet;
  }

  // create new wallet transaction
  async createNewTransaction(
    transaction: WalletTransactionDto,
    wallet: Wallet,
  ): Promise<Transaction> {
    // new transaction
    const newTransaction = await this.transactionRepository.save({
      amount: transaction.amount,
      transaction_ref: transaction.transactionRef,
      walletId: wallet.id,
    });

    // Update to user's wallet transaction
    wallet.transactions = [...wallet.transactions, newTransaction];
    await wallet.save();

    return newTransaction;
  }

  // Get all transactions for user
  async getAllTransactions(userId): Promise<Transaction[]> {
    const wallet = await this.getUserWalletById(userId);
    return wallet.transactions;
  }

  // Get all users transactions
  async getAllUsersTransactions(reqUser) {
    await this.verification.verifyAdmin(reqUser);

    const allUserWallets = await Wallet.find({});

    return allUserWallets.map((userWallet) => {
      const userId = userWallet.user;
      const transactions = userWallet.transactions;
      return {
        user: userId,
        transactions: transactions,
      };
    });
  }
}
