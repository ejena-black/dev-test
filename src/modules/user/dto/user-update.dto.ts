import { IsNotEmpty } from 'class-validator';

export class UserUpdate {
  @IsNotEmpty()
  address: string;
}
