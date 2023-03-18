import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WalletTransactionDto } from './dto/wallet-transaction.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  // Fund Wallet route
  @UseGuards(JwtAuthGuard)
  @Post('fund_wallet')
  async fundWallet(
    @Request() req,
    @Body() fundDetails: WalletTransactionDto,
  ): Promise<any> {
    return await this.walletService.fundWallet(req.user.id, fundDetails);
  }

  // Debit wallet
  @UseGuards(JwtAuthGuard)
  @Post('debit_wallet')
  async debitWallet(@Request() req, @Body() amount: WalletTransactionDto) {
    return this.walletService.debitWallet(req.user.id, amount);
  }

  // Generate transaction ref
  @UseGuards(JwtAuthGuard)
  @Get('generate_transaction_ref')
  async generateTransactionRef(@Request() req): Promise<any> {
    return await this.walletService.generateTransactionRef(req.user);
  }

  // Get all user transactions
  @UseGuards(JwtAuthGuard)
  @Get('all_transactions')
  async getAllTransactions(@Request() req) {
    return this.walletService.getAllTransactions(req.user.id);
  }

  // Get transaction of all users
  @UseGuards(JwtAuthGuard)
  @Get('get_all_transactions')
  async getAllUsersTransactions(@Request() req) {
    await this.walletService.getAllUsersTransactions(req.user);
  }
}
