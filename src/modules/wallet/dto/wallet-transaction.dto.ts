import { IsNotEmpty, IsNumber } from 'class-validator';

export class WalletTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  transactionRef: string;
}
