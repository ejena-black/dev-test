import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { MESSAGES, REGEX } from 'src/app.utils';

export class UserCreationDto {
  @IsNotEmpty()
  @Length(3, 15)
  firstName: string;

  @IsNotEmpty()
  @Length(3, 15)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 15)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  password: string;

  @IsNotEmpty()
  role: string;
}
