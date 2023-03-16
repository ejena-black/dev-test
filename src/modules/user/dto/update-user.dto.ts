import { IsNotEmpty } from 'class-validator';

export class UserUpdateDto {
  @IsNotEmpty()
  address: string;
}
